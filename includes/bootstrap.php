<?php
/* Loaded at the top of every page: settings, menu highlighting and the Coming Soon switch. */
if (!defined('SITE_ROOT')) define('SITE_ROOT', dirname(__DIR__));
require_once __DIR__ . '/config.php';

/* Marks the current menu item ($active is set at the top of each page). */
function cur($key) {
    global $active;
    return (isset($active) && $active === $key) ? ' aria-current="page"' : '';
}

/* Coming Soon: show the holding page unless the visitor has the preview key. */
if (COMING_SOON) {
    $hash = hash('sha256', PREVIEW_KEY);
    $ok = PREVIEW_KEY !== '' && isset($_COOKIE['site_preview']) && hash_equals($hash, (string) $_COOKIE['site_preview']);
    if (!$ok && PREVIEW_KEY !== '' && isset($_GET['preview']) && hash_equals(PREVIEW_KEY, (string) $_GET['preview'])) {
        setcookie('site_preview', $hash, ['expires' => time() + 30 * 86400, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
        $ok = true;
    }
    if (!$ok) {
        http_response_code(503);
        header('Retry-After: 86400');
        header('X-Robots-Tag: noindex, nofollow');
        define('SHOW_COMING_SOON', true);
        include SITE_ROOT . '/coming-soon.php';
        exit;
    }
}
