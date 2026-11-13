<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

// Always return JSON
header('Content-Type: application/json; charset=UTF-8');

// ------------------------
// CONFIG
// ------------------------
$toEmail           = "hi@codeller.com";
$fromEmail         = "no-reply@codeller.com";
$recaptchaSecret   = "6LfVJCMsAAAAAKSFBnNyKicFTRwYdBJTiEOSX-L1";
$minScore          = 0.5;
$rateLimitSeconds  = 60;

// ------------------------
// ONLY ALLOW POST
// ------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(["success" => false, "message" => "Method not allowed."]));
}

// ------------------------
// RATE LIMIT (per IP)
// ------------------------
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$isLocalhost = in_array($ip, ['127.0.0.1', '::1']);
$rateFile = sys_get_temp_dir() . '/contact_' . hash('sha256', $ip);

if (file_exists($rateFile) && (time() - filemtime($rateFile)) < $rateLimitSeconds) {
    http_response_code(429);
    exit(json_encode(["success" => false, "message" => "Too many requests. Please wait."]));
}
touch($rateFile);
@chmod($rateFile, 0600);

// ------------------------
// HONEYPOT CHECK
// ------------------------
if (!empty($_POST['company'])) {
    exit(json_encode(["success" => false]));
}

// ------------------------
// REQUIRED FIELDS
// ------------------------
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '') {
    exit(json_encode(["success" => false, "message" => "Required fields missing."]));
}

// ------------------------
// VALIDATE NAME
// ------------------------
if (!preg_match("/^[A-Za-zÀ-ÿ\\s\\-']+$/u", $name)) {
    exit(json_encode([
        "success" => false,
        "message" => "Name may only contain letters, spaces, hyphens, and apostrophes."
    ]));
}

// Normalize name spacing
$name = preg_replace('/\s+/', ' ', $name);

// ------------------------
// VALIDATE EMAIL
// ------------------------
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit(json_encode(["success" => false, "message" => "Invalid email address."]));
}

// Prevent header injection
$email = str_replace(["\r", "\n", "%0a", "%0d"], '', $email);

// ------------------------
// RECAPTCHA VALIDATION
// ------------------------
if (!$isLocalhost) {

  $token = $_POST['recaptcha_token'] ?? '';

  if (empty($token)) {
      exit(json_encode(["success" => false, "message" => "Security validation failed."]));
  }

  $recaptchaResponse = file_get_contents(
      "https://www.google.com/recaptcha/api/siteverify?secret={$recaptchaSecret}&response={$token}&remoteip={$ip}"
  );

  if ($recaptchaResponse === false) {
      exit(json_encode(["success" => false, "message" => "Verification service unavailable."]));
  }

  $result = json_decode($recaptchaResponse, true);

  if (
      empty($result['success']) ||
      ($result['score'] ?? 0) < $minScore ||
      ($result['action'] ?? '') !== 'contact'
  ) {
      exit(json_encode(["success" => false, "message" => "Spam detected."]));
  }
}


// ------------------------
// OPTIONAL FIELDS
// ------------------------
$subject = trim($_POST['enquiry-subject'] ?? 'General Enquiry');
$budget  = trim($_POST['project-budget'] ?? 'Not specified');

// ------------------------
// SANITISE OUTPUT (EMAIL SAFE)
// ------------------------
$cleanName    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$cleanEmail   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$cleanMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
$cleanSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$cleanBudget  = htmlspecialchars($budget, ENT_QUOTES, 'UTF-8');

// ------------------------
// EMAIL CONTENT
// ------------------------
$emailSubject = "New Contact Enquiry: {$cleanSubject}";

$emailBody = <<<EOT
Name: {$cleanName}
Email: {$cleanEmail}
Subject: {$cleanSubject}
Budget: {$cleanBudget}

Message:
{$cleanMessage}
EOT;

// Mailhog
$headers = implode("\r\n", [
    "From: Codeller <{$fromEmail}>",
    "Reply-To: {$cleanEmail}",
    "Content-Type: text/plain; charset=UTF-8",
    "X-Mailer: PHP/" . phpversion()
]);

// ------------------------
// SEND EMAIL
// ------------------------
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->Port       = 587;
    $mail->SMTPAuth   = true;
    $mail->Username   = 'hi@codeller.com';
    $mail->Password   = 'vwrk vxzt pfiy gqkd';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->setFrom('no-reply@codeller.com', 'Codeller');
    $mail->addAddress($toEmail);
    $mail->addReplyTo('hi@codeller.com', 'Codeller');

    $mail->Subject = $emailSubject;
    $mail->Body    = $emailBody;

    $mail->send();

    echo json_encode(["success" => true, "message" => "Message sent successfully."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Mailer Error"
    ]);
}
