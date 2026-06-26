<?php
/**
 * Приём лида квиза и запись в CSV (вне публичной папки).
 * Метод: POST application/json. Возвращает {"ok":true,"leadId":"..."}.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Только POST.
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Ограничиваем размер тела (64 КБ достаточно для лида).
$raw = file_get_contents('php://input', false, null, 0, 65536);
if ($raw === false || $raw === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'empty_body']);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_json']);
    exit;
}

// Каталог данных вне веб-рута.
$dir = '/var/www/usmanovafit__usr/data/leads';
if (!is_dir($dir)) {
    @mkdir($dir, 0750, true);
}
$csvPath = $dir . '/leads.csv';

/** Безопасное значение для CSV (защита от формул и переносов). */
function csv_cell($value): string
{
    if (is_array($value)) {
        $value = implode('; ', array_map(static function ($v) {
            return is_scalar($v) ? (string) $v : json_encode($v, JSON_UNESCAPED_UNICODE);
        }, $value));
    } elseif (is_bool($value)) {
        $value = $value ? 'true' : 'false';
    } elseif ($value === null) {
        $value = '';
    } else {
        $value = (string) $value;
    }

    // Обрезаем слишком длинные значения.
    if (mb_strlen($value) > 2000) {
        $value = mb_substr($value, 0, 2000);
    }

    // Защита от CSV-инъекций.
    if ($value !== '' && in_array($value[0], ['=', '+', '-', '@'], true)) {
        $value = "'" . $value;
    }

    return $value;
}

$sessionId = isset($data['sessionId']) && is_string($data['sessionId']) ? $data['sessionId'] : '';
$leadId = $sessionId !== '' ? $sessionId : bin2hex(random_bytes(8));

$answers = $data['answers'] ?? null;
$macros = $data['macros'] ?? null;
$utm = $data['utm'] ?? null;

$row = [
    gmdate('Y-m-d H:i:s') . ' UTC',
    $leadId,
    $data['name'] ?? '',
    $data['email'] ?? '',
    !empty($data['consentAccepted']) ? 'yes' : 'no',
    $data['status'] ?? '',
    $data['height'] ?? '',
    $data['currentWeight'] ?? '',
    $data['targetWeight'] ?? '',
    $data['resultType'] ?? '',
    $data['calorieNorm'] ?? '',
    is_array($macros) ? json_encode($macros, JSON_UNESCAPED_UNICODE) : '',
    is_array($utm) ? json_encode($utm, JSON_UNESCAPED_UNICODE) : '',
    $_SERVER['REMOTE_ADDR'] ?? '',
    is_array($answers) ? json_encode($answers, JSON_UNESCAPED_UNICODE) : '',
];

$cells = array_map('csv_cell', $row);

$header = [
    'created_at', 'lead_id', 'name', 'email', 'consent', 'status',
    'height', 'current_weight', 'target_weight', 'result_type',
    'calorie_norm', 'macros', 'utm', 'ip', 'answers',
];

$fp = @fopen($csvPath, 'a');
if ($fp === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'storage_unavailable']);
    exit;
}

if (flock($fp, LOCK_EX)) {
    $isNew = ftell($fp) === 0;
    if ($isNew) {
        fputcsv($fp, $header);
    }
    fputcsv($fp, $cells);
    fflush($fp);
    flock($fp, LOCK_UN);
}
fclose($fp);

echo json_encode(['ok' => true, 'leadId' => $leadId]);
