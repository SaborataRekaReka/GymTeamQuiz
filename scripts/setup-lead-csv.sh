#!/bin/bash
set -e

ROOT=/var/www/usmanovafit__usr/data/www/usmanovafit.auditerra.pro
DATA=/var/www/usmanovafit__usr/data/leads
CONF=/etc/nginx/fastpanel2-available/usmanovafit__usr/usmanovafit.auditerra.pro.conf
TS=$(date +%Y%m%d-%H%M%S)

# 1) Каталог для CSV вне веб-рута, доступный php-fpm (www-data).
mkdir -p "$DATA"
chown www-data:www-data "$DATA"
chmod 750 "$DATA"

# 2) Бэкап nginx-конфига.
cp -f "$CONF" "$CONF.bak.leadcsv-$TS"

# 3) Идемпотентно добавляем location для PHP-эндпоинта лида.
if grep -q "api/leads/upsert.php" "$CONF"; then
  echo "location_already_present"
else
  awk '
    !done && /location \/ \{/ {
      print "    location = /api/leads/upsert.php {"
      print "        include fastcgi_params;"
      print "        fastcgi_pass unix:/run/php/php7.4-fpm.sock;"
      print "        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;"
      print "    }"
      print ""
      done=1
    }
    { print }
  ' "$CONF" > "$CONF.tmp"
  mv -f "$CONF.tmp" "$CONF"
  echo "location_added"
fi

# 4) Проверка и перезагрузка nginx.
nginx -t
systemctl reload nginx || service nginx reload
echo "nginx_reloaded"
