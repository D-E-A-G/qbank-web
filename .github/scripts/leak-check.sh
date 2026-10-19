#!/usr/bin/env bash
# Fails when a change adds a secret or one of the owner's personal values (his
# home IP, the server's IP, the tailnet name, the Cloudflare account ID, his
# email addresses). It runs gitleaks twice: over the lines the change's commits
# add, and over every tracked file as they stand at HEAD.
#
# CI runs it on every pull request and every push to main (the "Secrets and
# personal values" job in .github/workflows/ci.yml). From the repository root:
#   .github/scripts/leak-check.sh <base commit> <head commit>
#
# Settings, from the environment:
#   GITLEAKS                 the gitleaks binary (default: gitleaks on PATH)
#   PERSONAL_VALUES          the personal values, one RE2 regular expression per
#                            line, matched without regard to case; blank lines
#                            and lines starting with # are skipped. In CI it is
#                            the Actions secret of the same name, the only place
#                            the list is kept. Never commit it.
#   REQUIRE_PERSONAL_VALUES  "true" makes an empty PERSONAL_VALUES an error.
#                            Otherwise (a pull request from a fork, which gets no
#                            secrets) only gitleaks' own rules run, with a warning.
#
# Findings are printed redacted, so the log never shows the value it found.
set -Eeuo pipefail

base="${1:?usage: leak-check.sh <base commit> <head commit>}"
head="${2:?usage: leak-check.sh <base commit> <head commit>}"
gitleaks="${GITLEAKS:-gitleaks}"

work="$(mktemp -d)"
trap 'rm -rf -- "$work"' EXIT

# gitleaks' own rules and this repository's exceptions (.gitleaks.toml), plus
# one rule built from the personal values.
config="$work/gitleaks.toml"
printf '[extend]\npath = "%s"\n' "$PWD/.gitleaks.toml" >"$config"
patterns=()
while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line%$'\r'}"
  [[ -z "${line//[[:space:]]/}" || "$line" == \#* ]] && continue
  patterns+=("$line")
done <<<"${PERSONAL_VALUES:-}"
if ((${#patterns[@]} > 0)); then
  regex="$(IFS='|' && printf '%s' "${patterns[*]}")"
  if [[ "$regex" == *"'''"* ]]; then
    echo "::error::PERSONAL_VALUES holds three single quotes in a row, which the gitleaks settings cannot carry"
    exit 1
  fi
  cat >>"$config" <<EOF

[[rules]]
id = "personal-value"
description = "One of the owner's personal values (the PERSONAL_VALUES secret)"
regex = '''(?i)(?:$regex)'''
EOF
  echo "Checking for secrets and ${#patterns[@]} personal values."
elif [[ "${REQUIRE_PERSONAL_VALUES:-}" == true ]]; then
  echo "::error::PERSONAL_VALUES is empty: set the Actions secret of that name (see server/apps/qbank/README.md in D-E-A-G/deag-infra)"
  exit 1
else
  echo "::warning::PERSONAL_VALUES is not available here (a pull request from a fork gets no secrets), so only secrets are checked"
fi

# The change's own commits. A base that is all zeros (a new branch) or that this
# clone does not hold (history rewritten by a force push) leaves just the head
# commit to check; the full check of the files below still covers the rest.
if [[ "$base" =~ ^0+$ ]] || ! git cat-file -e "$base^{commit}" 2>/dev/null; then
  echo "::warning::base commit $base is not available; checking only $head among the commits"
  log_opts="-1 $head"
else
  log_opts="$base..$head"
fi
echo "Commits: $log_opts"
"$gitleaks" git --config "$config" --log-opts "$log_opts" --redact --no-banner --verbose --exit-code 1 .

# Every tracked file at HEAD, so a value that was already in the repository
# before it joined the list is found too.
mkdir "$work/tree"
git archive HEAD | tar -x -C "$work/tree"
echo "Files at HEAD ($(git rev-parse --short HEAD))"
"$gitleaks" dir --config "$config" --redact --no-banner --verbose --exit-code 1 "$work/tree"
