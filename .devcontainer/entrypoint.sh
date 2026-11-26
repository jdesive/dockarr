#!/bin/sh
# kennel:generated sha256=c4953fcdd1c88e0ec0849941156227cdd82fcddfb336b208c43c54115b90a254
# Starts the agent container. Exports each declared secret as an environment variable from its
# mounted file, so the value never appears in `docker inspect`, in generated files or in logs.
# KENNEL_SECRETS_ENV is a list of "name:ENVVAR" pairs separated by ';' (names and variable names
# are validated by kennel; ENVVAR may be empty when the secret is only mounted as a file).
set -eu

if [ -n "${KENNEL_SECRETS_ENV:-}" ]; then
  old_ifs=$IFS
  IFS=';'
  for pair in $KENNEL_SECRETS_ENV; do
    name=${pair%%:*}
    var=${pair#*:}
    [ -n "$var" ] || continue
    file="/run/secrets/$name"
    if [ ! -r "$file" ]; then
      echo "kennel: secret '$name' is declared but $file is not readable" >&2
      exit 1
    fi
    value=$(cat "$file")
    export "$var=$value"
  done
  IFS=$old_ifs
  unset KENNEL_SECRETS_ENV
fi

exec "$@"
