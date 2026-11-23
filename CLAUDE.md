# Sincronización con GitHub

Este proyecto local debe mantenerse igual que `origin/main` del repo `paurodber-web/steff`, pero **nunca de forma automática**. Los cambios se hacen de noche en la nube, directamente en GitHub.

## Al inicio de cada sesión

En el primer mensaje de la sesión, antes de hacer cualquier otra cosa (incluido un saludo):

1. Ejecuta `git fetch origin main` y compara `HEAD` con `origin/main`. Revisa también `git status` por cambios locales sin commitear y por commits locales que no están en GitHub (`git rev-list --count origin/main..HEAD`).
2. Responde al usuario con un resumen breve:
   - Si local y GitHub son iguales y no hay cambios locales: dilo y pregunta si quiere hacer algo más. No sincronices.
   - Si hay cambios en GitHub, en local o ambos: lista qué cambió (commits nuevos, archivos modificados) y **pregunta si quiere sincronizar** antes de tocar nada.
   - Si no se puede conectar a GitHub: dilo y sigue sin sincronizar.

## Cuando el usuario confirme sincronizar

Ejecuta `bash .claude/scripts/sync-github.sh`. Ese script:
- guarda cambios sin commitear en `git stash`,
- respalda commits locales no publicados en una rama `backup-local-...`,
- deja `main` igual que `origin/main`.

Antes de ejecutarlo, si hay commits locales o cambios sin commitear, menciónalos al usuario en la pregunta de confirmación.

Nunca hagas `git reset --hard`, `git push` ni borres ramas sin una confirmación explícita del usuario para esa acción concreta.
