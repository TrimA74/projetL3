<?php
chown -R www-data:www-data
echo shell_exec("git pull 2>&1");
echo shell_exec("whoami");

?>
