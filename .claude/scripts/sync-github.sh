#!/usr/bin/env bash
# Deja el proyecto local igual que origin/main de GitHub.
# Se ejecuta al abrir una sesión de Claude en este proyecto (hook SessionStart).
# Si no hay red o falla algo, no bloquea la sesión.

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

BRANCH="main"

if ! git fetch --quiet origin "$BRANCH" 2>/dev/null; then
  echo "[sync] No se pudo consultar GitHub; se usa la copia local."
  exit 0
fi

# Guarda cualquier cambio local sin commitear antes de sincronizar (recuperable con git stash pop).
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  git stash push --quiet -m "auto-stash antes de sync $(date +%Y-%m-%d_%H-%M)"
  echo "[sync] Cambios locales sin commitear guardados en git stash."
fi

# Si main tiene commits locales que no están en GitHub, se respaldan en una rama antes de igualar.
if [ "$(git rev-list --count "origin/$BRANCH..HEAD" 2>/dev/null)" != "0" ]; then
  STAMP=$(date +%Y%m%d-%H%M%S)
  git branch "backup-local-$STAMP" HEAD
  echo "[sync] Commits locales no publicados respaldados en backup-local-$STAMP."
fi

git checkout --quiet "$BRANCH" 2>/dev/null
git reset --hard --quiet "origin/$BRANCH"
echo "[sync] Local igual a origin/$BRANCH ($(git rev-parse --short HEAD))."
exit 0
