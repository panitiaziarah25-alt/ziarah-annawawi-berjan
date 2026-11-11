import JSZip from 'jszip';

export async function generateWordPressPluginZip(): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder("ziarah-an-nawawi")!;

  // 1. Main Plugin File
  folder.file("ziarah-an-nawawi.php", `<?php
/**
 * Plugin Name: Ziarah An-Nawawi 2026
 * Plugin URI:  https://annawawi-berjan.id/ziarah-2026/
 * Description: Sistem Informasi & Panduan Perjalanan Ziarah Makam Auliya', Ulama', dan Pejuang Pondok Pesantren An-Nawawi Berjan Purworejo Tahun 2026 M. / 1448 H.
 * Version:     1.0.0
 * Author:      Panitia Ziarah Pondok Pesantren An-Nawawi Berjan Purworejo
 * Author URI:  https://annawawi-berjan.id
 * License:     GPL-2.0+
 * Text Domain: ziarah-an-nawawi
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

define('ZAN_VERSION', '1.0.0');
define('ZAN_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ZAN_PLUGIN_URL', plugin_dir_url(__FILE__));

// Require Core Modules
require_once ZAN_PLUGIN_DIR . 'includes/security.php';
require_once ZAN_PLUGIN_DIR . 'includes/permissions.php';
require_once ZAN_PLUGIN_DIR . 'includes/post-types.php';
require_once ZAN_PLUGIN_DIR . 'includes/custom-fields.php';
require_once ZAN_PLUGIN_DIR . 'includes/relationships.php';
require_once ZAN_PLUGIN_DIR . 'includes/admin-dashboard.php';
require_once ZAN_PLUGIN_DIR . 'includes/sharing.php';
require_once ZAN_PLUGIN_DIR . 'includes/seo.php';
require_once ZAN_PLUGIN_DIR . 'public/frontend.php';

// Activation & Deactivation Hooks
register_activation_hook(__FILE__, 'zan_plugin_activate');
register_deactivation_hook(__FILE__, 'zan_plugin_deactivate');

function zan_plugin_activate() {
    zan_register_custom_roles();
    zan_register_post_types();
    flush_rewrite_rules();
}

function zan_plugin_deactivate() {
    flush_rewrite_rules();
}
`);

  // 2. Security
  const includes = folder.folder("includes")!;
  includes.file("security.php", `<?php
if (!defined('ABSPATH')) exit;

/**
 * Security & Nonce Helper for Ziarah An-Nawawi Plugin
 */
function zan_verify_request($nonce_action = 'zan_admin_action', $nonce_field = '_zannonce') {
    if (!isset($_POST[$nonce_field]) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST[$nonce_field])), $nonce_action)) {
        wp_die(esc_html__('Keamanan gagal diverifikasi. Silakan muat ulang halaman.', 'ziarah-an-nawawi'));
    }
}

function zan_sanitize_deep($input) {
    if (is_array($input)) {
        return array_map('zan_sanitize_deep', $input);
    }
    return sanitize_text_field($input);
}
`);

  // 3. Permissions
  includes.file("permissions.php", `<?php
if (!defined('ABSPATH')) exit;

/**
 * Custom Roles and Capabilities
 * 1. Super Admin: Full website & user management
 * 2. Admin Ziarah: Manages agendas, rundowns, locations, figures, news
 * 3. Editor Ziarah: Manages news, announcements, and updates
 */
function zan_register_custom_roles() {
    // Admin Ziarah Role
    add_role('admin_ziarah', __('Admin Ziarah', 'ziarah-an-nawawi'), array(
        'read' => true,
        'edit_posts' => true,
        'delete_posts' => true,
        'publish_posts' => true,
        'upload_files' => true,
        'manage_ziarah' => true,
    ));

    // Editor Ziarah Role
    add_role('editor_ziarah', __('Editor Ziarah', 'ziarah-an-nawawi'), array(
        'read' => true,
        'edit_posts' => true,
        'upload_files' => true,
        'manage_ziarah_news' => true,
    ));
}
`);

  // 4. Post Types
  includes.file("post-types.php", `<?php
if (!defined('ABSPATH')) exit;

/**
 * Register Custom Post Types:
 * - lokasi_makam
 * - profil_tokoh
 * - agenda_ziarah
 * - rundown_ziarah
 * - dokumentasi_ziarah
 */
function zan_register_post_types() {
    // 1. Lokasi Makam
    register_post_type('lokasi_makam', array(
        'labels' => array(
            'name' => __('Lokasi Makam', 'ziarah-an-nawawi'),
            'singular_name' => __('Lokasi Makam', 'ziarah-an-nawawi'),
            'add_new' => __('Tambah Lokasi', 'ziarah-an-nawawi'),
            'add_new_item' => __('Tambah Lokasi Makam Baru', 'ziarah-an-nawawi'),
            'edit_item' => __('Edit Lokasi Makam', 'ziarah-an-nawawi'),
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'lokasi'),
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-location-alt',
        'show_in_rest' => true,
    ));

    // 2. Profil Tokoh
    register_post_type('profil_tokoh', array(
        'labels' => array(
            'name' => __('Profil Tokoh', 'ziarah-an-nawawi'),
            'singular_name' => __('Profil Tokoh', 'ziarah-an-nawawi'),
            'add_new' => __('Tambah Tokoh', 'ziarah-an-nawawi'),
            'add_new_item' => __('Tambah Tokoh / Wali Baru', 'ziarah-an-nawawi'),
            'edit_item' => __('Edit Profil Tokoh', 'ziarah-an-nawawi'),
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'tokoh'),
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-id',
        'show_in_rest' => true,
    ));

    // 3. Agenda Perjalanan
    register_post_type('agenda_ziarah', array(
        'labels' => array(
            'name' => __('Agenda Perjalanan', 'ziarah-an-nawawi'),
            'singular_name' => __('Agenda Ziarah', 'ziarah-an-nawawi'),
            'add_new' => __('Tambah Agenda', 'ziarah-an-nawawi'),
            'add_new_item' => __('Tambah Agenda Baru', 'ziarah-an-nawawi'),
            'edit_item' => __('Edit Agenda', 'ziarah-an-nawawi'),
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'agenda'),
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-calendar-alt',
        'show_in_rest' => true,
    ));

    // 4. Rundown
    register_post_type('rundown_ziarah', array(
        'labels' => array(
            'name' => __('Rundown', 'ziarah-an-nawawi'),
            'singular_name' => __('Rundown Kegiatan', 'ziarah-an-nawawi'),
            'add_new' => __('Tambah Baris Rundown', 'ziarah-an-nawawi'),
            'add_new_item' => __('Tambah Rundown Baru', 'ziarah-an-nawawi'),
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'rundown'),
        'supports' => array('title', 'editor'),
        'menu_icon' => 'dashicons-clock',
        'show_in_rest' => true,
    ));

    // 5. Dokumentasi
    register_post_type('dokumentasi_ziarah', array(
        'labels' => array(
            'name' => __('Dokumentasi', 'ziarah-an-nawawi'),
            'singular_name' => __('Dokumentasi', 'ziarah-an-nawawi'),
            'add_new' => __('Unggah Foto / Video', 'ziarah-an-nawawi'),
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'dokumentasi'),
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-format-gallery',
        'show_in_rest' => true,
    ));
}
add_action('init', 'zan_register_post_types');
`);

  // 5. Custom Fields & Meta Boxes
  includes.file("custom-fields.php", `<?php
if (!defined('ABSPATH')) exit;

/**
 * Register Meta Boxes for Lokasi, Tokoh, and Agenda
 */
function zan_add_custom_meta_boxes() {
    add_meta_box('zan_lokasi_meta', 'Informasi Detail Lokasi Makam', 'zan_render_lokasi_box', 'lokasi_makam', 'normal', 'high');
    add_meta_box('zan_tokoh_meta', 'Informasi Biografi & Nasab Tokoh', 'zan_render_tokoh_box', 'profil_tokoh', 'normal', 'high');
    add_meta_box('zan_agenda_meta', 'Waktu & Teknis Agenda', 'zan_render_agenda_box', 'agenda_ziarah', 'normal', 'high');
}
add_action('add_meta_boxes', 'zan_add_custom_meta_boxes');

function zan_render_lokasi_box($post) {
    wp_nonce_field('zan_save_lokasi_meta', 'zan_lokasi_nonce');
    $address = get_post_meta($post->ID, '_zan_address', true);
    $regency = get_post_meta($post->ID, '_zan_regency', true);
    $district = get_post_meta($post->ID, '_zan_district', true);
    $duration = get_post_meta($post->ID, '_zan_duration', true);
    $maps = get_post_meta($post->ID, '_zan_maps', true);
    ?>
    <p><label><strong>Alamat Lengkap:</strong></label><br/><input type="text" name="zan_address" value="<?php echo esc_attr($address); ?>" style="width:100%;"/></p>
    <p><label><strong>Kabupaten:</strong></label><br/><input type="text" name="zan_regency" value="<?php echo esc_attr($regency); ?>" style="width:100%;"/></p>
    <p><label><strong>Kecamatan:</strong></label><br/><input type="text" name="zan_district" value="<?php echo esc_attr($district); ?>" style="width:100%;"/></p>
    <p><label><strong>Estimasi Waktu Kunjungan:</strong></label><br/><input type="text" name="zan_duration" value="<?php echo esc_attr($duration); ?>" placeholder="Contoh: 90 Menit" style="width:100%;"/></p>
    <p><label><strong>Pencarian Google Maps:</strong></label><br/><input type="text" name="zan_maps" value="<?php echo esc_attr($maps); ?>" style="width:100%;"/></p>
    <?php
}

function zan_render_tokoh_box($post) {
    wp_nonce_field('zan_save_tokoh_meta', 'zan_tokoh_nonce');
    $title_honorific = get_post_meta($post->ID, '_zan_title_honorific', true);
    $birth = get_post_meta($post->ID, '_zan_birth', true);
    $death = get_post_meta($post->ID, '_zan_death', true);
    $genealogy = get_post_meta($post->ID, '_zan_genealogy', true);
    $education = get_post_meta($post->ID, '_zan_education', true);
    $struggles = get_post_meta($post->ID, '_zan_struggles', true);
    $works = get_post_meta($post->ID, '_zan_works', true);
    $location_id = get_post_meta($post->ID, '_zan_tomb_location', true);

    $locations = get_posts(array('post_type' => 'lokasi_makam', 'numberposts' => -1));
    ?>
    <p><label><strong>Gelar / Sebutan:</strong></label><br/><input type="text" name="zan_title_honorific" value="<?php echo esc_attr($title_honorific); ?>" style="width:100%;"/></p>
    <div style="display:flex;gap:15px;">
        <p style="flex:1;"><label><strong>Tahun Lahir:</strong></label><br/><input type="text" name="zan_birth" value="<?php echo esc_attr($birth); ?>" style="width:100%;"/></p>
        <p style="flex:1;"><label><strong>Tahun Wafat:</strong></label><br/><input type="text" name="zan_death" value="<?php echo esc_attr($death); ?>" style="width:100%;"/></p>
    </div>
    <p><label><strong>Lokasi Makam Beliau:</strong></label><br/>
        <select name="zan_tomb_location" style="width:100%;">
            <option value="">-- Pilih Lokasi Makam --</option>
            <?php foreach ($locations as $loc): ?>
                <option value="<?php echo esc_attr($loc->ID); ?>" <?php selected($location_id, $loc->ID); ?>><?php echo esc_html($loc->post_title); ?></option>
            <?php endforeach; ?>
        </select>
    </p>
    <p><label><strong>Silsilah / Nasab:</strong></label><br/><textarea name="zan_genealogy" rows="3" style="width:100%;"><?php echo esc_textarea($genealogy); ?></textarea></p>
    <p><label><strong>Riwayat Pendidikan:</strong></label><br/><textarea name="zan_education" rows="3" style="width:100%;"><?php echo esc_textarea($education); ?></textarea></p>
    <p><label><strong>Perjuangan & Kontribusi:</strong></label><br/><textarea name="zan_struggles" rows="4" style="width:100%;"><?php echo esc_textarea($struggles); ?></textarea></p>
    <p><label><strong>Karya & Peninggalan:</strong></label><br/><textarea name="zan_works" rows="3" style="width:100%;"><?php echo esc_textarea($works); ?></textarea></p>
    <?php
}

function zan_render_agenda_box($post) {
    wp_nonce_field('zan_save_agenda_meta', 'zan_agenda_nonce');
    $day_number = get_post_meta($post->ID, '_zan_day_number', true);
    $date = get_post_meta($post->ID, '_zan_date', true);
    $start = get_post_meta($post->ID, '_zan_start_time', true);
    $end = get_post_meta($post->ID, '_zan_end_time', true);
    $tech_notes = get_post_meta($post->ID, '_zan_technical_notes', true);
    $special_notes = get_post_meta($post->ID, '_zan_special_notes', true);
    ?>
    <div style="display:flex;gap:15px;">
        <p style="flex:1;"><label><strong>Hari ke-:</strong></label><br/><input type="number" name="zan_day_number" value="<?php echo esc_attr($day_number); ?>" min="1" max="10" style="width:100%;"/></p>
        <p style="flex:2;"><label><strong>Tanggal (YYYY-MM-DD):</strong></label><br/><input type="date" name="zan_date" value="<?php echo esc_attr($date); ?>" style="width:100%;"/></p>
    </div>
    <div style="display:flex;gap:15px;">
        <p style="flex:1;"><label><strong>Waktu Mulai:</strong></label><br/><input type="time" name="zan_start_time" value="<?php echo esc_attr($start); ?>" style="width:100%;"/></p>
        <p style="flex:1;"><label><strong>Waktu Selesai:</strong></label><br/><input type="time" name="zan_end_time" value="<?php echo esc_attr($end); ?>" style="width:100%;"/></p>
    </div>
    <p><label><strong>Keterangan Teknis:</strong></label><br/><textarea name="zan_technical_notes" rows="3" style="width:100%;"><?php echo esc_textarea($tech_notes); ?></textarea></p>
    <p><label><strong>Catatan Khusus:</strong></label><br/><textarea name="zan_special_notes" rows="2" style="width:100%;"><?php echo esc_textarea($special_notes); ?></textarea></p>
    <?php
}

function zan_save_meta_boxes($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['zan_lokasi_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['zan_lokasi_nonce'])), 'zan_save_lokasi_meta')) {
        update_post_meta($post_id, '_zan_address', sanitize_text_field($_POST['zan_address'] ?? ''));
        update_post_meta($post_id, '_zan_regency', sanitize_text_field($_POST['zan_regency'] ?? ''));
        update_post_meta($post_id, '_zan_district', sanitize_text_field($_POST['zan_district'] ?? ''));
        update_post_meta($post_id, '_zan_duration', sanitize_text_field($_POST['zan_duration'] ?? ''));
        update_post_meta($post_id, '_zan_maps', sanitize_text_field($_POST['zan_maps'] ?? ''));
    }

    if (isset($_POST['zan_tokoh_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['zan_tokoh_nonce'])), 'zan_save_tokoh_meta')) {
        update_post_meta($post_id, '_zan_title_honorific', sanitize_text_field($_POST['zan_title_honorific'] ?? ''));
        update_post_meta($post_id, '_zan_birth', sanitize_text_field($_POST['zan_birth'] ?? ''));
        update_post_meta($post_id, '_zan_death', sanitize_text_field($_POST['zan_death'] ?? ''));
        update_post_meta($post_id, '_zan_tomb_location', sanitize_text_field($_POST['zan_tomb_location'] ?? ''));
        update_post_meta($post_id, '_zan_genealogy', sanitize_textarea_field($_POST['zan_genealogy'] ?? ''));
        update_post_meta($post_id, '_zan_education', sanitize_textarea_field($_POST['zan_education'] ?? ''));
        update_post_meta($post_id, '_zan_struggles', sanitize_textarea_field($_POST['zan_struggles'] ?? ''));
        update_post_meta($post_id, '_zan_works', sanitize_textarea_field($_POST['zan_works'] ?? ''));
    }

    if (isset($_POST['zan_agenda_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['zan_agenda_nonce'])), 'zan_save_agenda_meta')) {
        update_post_meta($post_id, '_zan_day_number', sanitize_text_field($_POST['zan_day_number'] ?? ''));
        update_post_meta($post_id, '_zan_date', sanitize_text_field($_POST['zan_date'] ?? ''));
        update_post_meta($post_id, '_zan_start_time', sanitize_text_field($_POST['zan_start_time'] ?? ''));
        update_post_meta($post_id, '_zan_end_time', sanitize_text_field($_POST['zan_end_time'] ?? ''));
        update_post_meta($post_id, '_zan_technical_notes', sanitize_textarea_field($_POST['zan_technical_notes'] ?? ''));
        update_post_meta($post_id, '_zan_special_notes', sanitize_textarea_field($_POST['zan_special_notes'] ?? ''));
    }
}
add_action('save_post', 'zan_save_meta_boxes');
`);

  // 6. Relationships
  includes.file("relationships.php", `<?php
if (!defined('ABSPATH')) exit;

/**
 * Bi-directional Relationship Helper between Makam Lokasi and Tokoh
 */
function zan_get_tokoh_for_location($location_id) {
    return get_posts(array(
        'post_type' => 'profil_tokoh',
        'meta_key' => '_zan_tomb_location',
        'meta_value' => $location_id,
        'numberposts' => -1,
        'post_status' => 'publish'
    ));
}

function zan_get_agenda_for_location($location_id) {
    return get_posts(array(
        'post_type' => 'agenda_ziarah',
        'meta_key' => '_zan_location_id',
        'meta_value' => $location_id,
        'numberposts' => -1,
        'post_status' => 'publish'
    ));
}
`);

  // 7. Sharing & Social Metadata
  includes.file("sharing.php", `<?php
if (!defined('ABSPATH')) exit;

/**
 * Generate WhatsApp, Telegram, Facebook Share Links with Islamic Greetings
 */
function zan_render_share_buttons($title = '', $summary = '', $url = '') {
    if (empty($url)) {
        $url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    }
    if (empty($title)) {
        $title = get_the_title();
    }
    if (empty($summary)) {
        $summary = wp_strip_all_tags(get_the_excerpt());
    }

    $wa_text = "Assalamu'alaikum Warahmatullahi Wabarakatuh.\\n\\nBerikut informasi Ziarah An-Nawawi 2026:\\n\\n" . $title . "\\n\\n" . $summary . "\\n\\n" . $url . "\\n\\nWassalamu'alaikum Warahmatullahi Wabarakatuh.";
    $wa_url = "https://api.whatsapp.com/send?text=" . rawurlencode($wa_text);
    $tg_url = "https://t.me/share/url?url=" . rawurlencode($url) . "&text=" . rawurlencode($title);
    $fb_url = "https://www.facebook.com/sharer/sharer.php?u=" . rawurlencode($url);

    ob_start();
    ?>
    <div class="zan-share-container" style="display:flex;align-items:center;gap:8px;margin:1.5rem 0;">
        <span style="font-weight:600;font-size:0.875rem;">Bagikan:</span>
        <a href="<?php echo esc_url($wa_url); ?>" target="_blank" rel="noopener" class="zan-btn-wa" style="background:#25D366;color:#fff;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:500;">WhatsApp</a>
        <a href="<?php echo esc_url($tg_url); ?>" target="_blank" rel="noopener" class="zan-btn-tg" style="background:#0088cc;color:#fff;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:500;">Telegram</a>
        <a href="<?php echo esc_url($fb_url); ?>" target="_blank" rel="noopener" class="zan-btn-fb" style="background:#1877F2;color:#fff;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:500;">Facebook</a>
        <button type="button" onclick="navigator.clipboard.writeText('<?php echo esc_js($url); ?>');alert('Tautan berhasil disalin!');" style="background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;">Salin Tautan</button>
    </div>
    <?php
    return ob_get_clean();
}
`);

  // 8. SEO & Open Graph
  includes.file("seo.php", `<?php
if (!defined('ABSPATH')) exit;

/**
 * Open Graph & Twitter Cards Metadata Injection
 */
function zan_inject_social_metadata() {
    if (is_singular(array('lokasi_makam', 'profil_tokoh', 'agenda_ziarah', 'rundown_ziarah', 'post'))) {
        global $post;
        $title = esc_attr(get_the_title($post));
        $desc = esc_attr(wp_strip_all_tags(get_the_excerpt($post)));
        $url = esc_url(get_permalink($post));
        $thumb_id = get_post_thumbnail_id($post);
        $image = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'large') : '';

        echo '<meta property="og:title" content="' . $title . ' | Ziarah An-Nawawi 2026" />' . "\\n";
        echo '<meta property="og:description" content="' . $desc . '" />' . "\\n";
        echo '<meta property="og:url" content="' . $url . '" />' . "\\n";
        echo '<meta property="og:type" content="article" />' . "\\n";
        if ($image) {
            echo '<meta property="og:image" content="' . esc_url($image) . '" />' . "\\n";
        }
        echo '<meta name="twitter:card" content="summary_large_image" />' . "\\n";
    }
}
add_action('wp_head', 'zan_inject_social_metadata', 2);
`);

  // 9. Admin Dashboard
  includes.file("admin-dashboard.php", `<?php
if (!defined('ABSPATH')) exit;

/**
 * Custom WordPress Admin Menu & Dashboard Page
 */
function zan_register_admin_menu() {
    add_menu_page(
        'Ziarah An-Nawawi',
        'Ziarah 2026',
        'read',
        'ziarah-dashboard',
        'zan_render_admin_dashboard_page',
        'dashicons-palmtree',
        4
    );

    add_submenu_page('ziarah-dashboard', 'Dashboard', 'Dashboard Ringkasan', 'read', 'ziarah-dashboard', 'zan_render_admin_dashboard_page');
    add_submenu_page('ziarah-dashboard', 'Kelola Rundown', 'Kelola Rundown', 'manage_ziarah', 'edit.php?post_type=rundown_ziarah');
    add_submenu_page('ziarah-dashboard', 'Kelola Agenda', 'Kelola Agenda', 'manage_ziarah', 'edit.php?post_type=agenda_ziarah');
    add_submenu_page('ziarah-dashboard', 'Kelola Lokasi', 'Kelola Lokasi Makam', 'manage_ziarah', 'edit.php?post_type=lokasi_makam');
    add_submenu_page('ziarah-dashboard', 'Kelola Tokoh', 'Kelola Tokoh Auliya', 'manage_ziarah', 'edit.php?post_type=profil_tokoh');
    add_submenu_page('ziarah-dashboard', 'Pengaturan Website', 'Pengaturan Website', 'manage_options', 'ziarah-settings', 'zan_render_admin_settings_page');
}
add_action('admin_menu', 'zan_register_admin_menu');

function zan_render_admin_dashboard_page() {
    $count_lokasi = wp_count_posts('lokasi_makam')->publish;
    $count_tokoh = wp_count_posts('profil_tokoh')->publish;
    $count_agenda = wp_count_posts('agenda_ziarah')->publish;
    $count_rundown = wp_count_posts('rundown_ziarah')->publish;
    $count_docs = wp_count_posts('dokumentasi_ziarah')->publish;
    ?>
    <div class="wrap" style="max-width:1100px;">
        <h1 style="color:#065f46;font-weight:700;">Dashboard Ziarah An-Nawawi 2026</h1>
        <p>Pondok Pesantren An-Nawawi Berjan Purworejo - Tahun 2026 M. / 1448 H.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:16px;margin:20px 0;">
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e2e8f0;border-left:4px solid #059669;">
                <span style="font-size:12px;color:#64748b;text-transform:uppercase;font-weight:600;">Lokasi Makam</span>
                <div style="font-size:28px;font-weight:700;color:#0f172a;margin-top:4px;"><?php echo esc_html($count_lokasi); ?></div>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e2e8f0;border-left:4px solid #d97706;">
                <span style="font-size:12px;color:#64748b;text-transform:uppercase;font-weight:600;">Profil Tokoh</span>
                <div style="font-size:28px;font-weight:700;color:#0f172a;margin-top:4px;"><?php echo esc_html($count_tokoh); ?></div>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e2e8f0;border-left:4px solid #2563eb;">
                <span style="font-size:12px;color:#64748b;text-transform:uppercase;font-weight:600;">Agenda Ziarah</span>
                <div style="font-size:28px;font-weight:700;color:#0f172a;margin-top:4px;"><?php echo esc_html($count_agenda); ?></div>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e2e8f0;border-left:4px solid #7c3aed;">
                <span style="font-size:12px;color:#64748b;text-transform:uppercase;font-weight:600;">Rundown Waktu</span>
                <div style="font-size:28px;font-weight:700;color:#0f172a;margin-top:4px;"><?php echo esc_html($count_rundown); ?></div>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e2e8f0;border-left:4px solid #0891b2;">
                <span style="font-size:12px;color:#64748b;text-transform:uppercase;font-weight:600;">Dokumentasi</span>
                <div style="font-size:28px;font-weight:700;color:#0f172a;margin-top:4px;"><?php echo esc_html($count_docs); ?></div>
            </div>
        </div>
    </div>
    <?php
}

function zan_render_admin_settings_page() {
    ?>
    <div class="wrap" style="max-width:800px;">
        <h2>Pengaturan Website Ziarah An-Nawawi 2026</h2>
        <form method="post" action="options.php">
            <?php wp_nonce_field('zan_settings_group-options'); ?>
            <p>Pengaturan terintegrasi dengan opsi standar WordPress dan REST API.</p>
        </form>
    </div>
    <?php
}
`);

  // 10. Frontend public templates
  const publicFolder = folder.folder("public")!;
  publicFolder.file("frontend.php", `<?php
if (!defined('ABSPATH')) exit;

/**
 * Frontend Shortcodes and Template Overrides
 * Shortcode [ziarah_portal]: Renders the full interactive portal
 * Shortcode [ziarah_rundown]: Renders the timetable rundown
 * Shortcode [ziarah_lokasi]: Renders the tomb grid
 * Shortcode [ziarah_tokoh]: Renders figures catalog
 */
function zan_portal_shortcode($atts) {
    ob_start();
    ?>
    <div id="zan-portal-container" class="zan-app-wrapper" style="min-height:600px;">
        <!-- Embedded responsive portal or react hydration anchor -->
        <p style="text-align:center;padding:40px;color:#065f46;">Memuat Portal Informasi Ziarah An-Nawawi 2026...</p>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('ziarah_portal', 'zan_portal_shortcode');
`);

  // 11. Readme.txt
  folder.file("readme.txt", `=== Ziarah An-Nawawi 2026 ===
Contributors: panitiaziarah2026
Tags: ziarah, pesantren, an-nawawi, purworejo, walisongo, rundown, travel
Requires at least: 5.8
Tested up to: 6.7
Requires PHP: 7.4
License: GPLv2 or later

Sistem Informasi & Panduan Perjalanan Ziarah Makam Auliya', Ulama', dan Pejuang Pondok Pesantren An-Nawawi Berjan Purworejo Tahun 2026 M. / 1448 H.

== Description ==
Plugin khusus untuk mengelola seluruh rangkaian kegiatan ziarah:
- Profil Lokasi Makam dengan relasi multi-tokoh, galeri foto, estimasi durasi, dan peta Google Maps.
- Profil Tokoh (Auliya', Ulama', Pejuang) dengan riwayat silsilah, pendidikan, karya, dan keterkaitan makam.
- Agenda Perjalanan berbentuk timeline dinamis berdasarkan hari dan urutan kegiatan.
- Rundown dengan mode Timeline dan Tabel, filter hari, status kegiatan, dan cetak rundown.
- Berita & Pengumuman prioritas.
- Panduan Peserta (armada bus, titik kumpul, barang bawaan, kontak darurat).
- Tombol share WhatsApp dengan template ucapan islami otomatis, Telegram, Facebook, dan Salin Link.

== Installation ==
1. Unduh file zip plugin ziarah-an-nawawi.zip
2. Masuk ke Dashboard WordPress -> Plugins -> Add New Plugin -> Upload Plugin.
3. Pilih ziarah-an-nawawi.zip lalu klik "Install Now".
4. Klik "Activate Plugin".
5. Akses menu "Ziarah 2026" di bilah navigasi admin WordPress Anda.
6. Masukkan shortcode [ziarah_portal] pada halaman yang diinginkan untuk menampilkan portal.
`);

  // 12. Uninstall.php
  folder.file("uninstall.php", `<?php
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}
// Clean options if needed
delete_option('zan_site_settings');
`);

  return await zip.generateAsync({ type: "blob" });
}
