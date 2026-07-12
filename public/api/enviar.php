<?php
// Endpoint del formulario de contacto de museofmusic.art
// La configuración SMTP vive FUERA del docroot (el deploy borra dist/):
//   /var/www/museofmusic/contacto.config.php
// PHPMailer (Exception.php, PHPMailer.php, SMTP.php) en:
//   /var/www/museofmusic/phpmailer/

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
  exit;
}

// Honeypot: si el campo oculto viene relleno, es un bot. Fingimos éxito.
if (!empty($_POST['web'] ?? '')) {
  echo json_encode(['ok' => true]);
  exit;
}

$nombre  = trim($_POST['nombre'] ?? '');
$email   = trim($_POST['email'] ?? '');
$mensaje = trim($_POST['mensaje'] ?? '');

if ($nombre === '' || $mensaje === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Revisa los campos del formulario']);
  exit;
}
if (mb_strlen($nombre) > 120 || mb_strlen($email) > 160 || mb_strlen($mensaje) > 4000) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Mensaje demasiado largo']);
  exit;
}

$configPath = '/var/www/museofmusic/contacto.config.php';
$pmPath     = '/var/www/museofmusic/phpmailer';
if (!file_exists($configPath) || !file_exists("$pmPath/PHPMailer.php")) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Formulario no configurado todavía']);
  exit;
}
$cfg = require $configPath;

require "$pmPath/Exception.php";
require "$pmPath/PHPMailer.php";
require "$pmPath/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host       = $cfg['host'];
  $mail->SMTPAuth   = true;
  $mail->Username   = $cfg['user'];
  $mail->Password   = $cfg['pass'];
  $mail->SMTPSecure = $cfg['secure']; // 'tls' o 'ssl'
  $mail->Port       = $cfg['port'];
  $mail->CharSet    = 'UTF-8';

  // From = la propia cuenta autenticada (SPF/DMARC contentos);
  // el visitante va en Reply-To para responderle con un clic.
  $mail->setFrom($cfg['user'], 'Formulario museofmusic.art');
  $mail->addAddress($cfg['user']);
  $mail->addReplyTo($email, $nombre);

  $mail->Subject = 'Contacto web: ' . mb_substr($nombre, 0, 60);
  $mail->Body    = "Nombre: $nombre\nEmail: $email\n\n$mensaje";

  $mail->send();
  echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el mensaje']);
}