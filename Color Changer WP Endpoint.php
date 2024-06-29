<?php
/*
Plugin Name: Color Changer Plugin
Description: Plugin for managing and displaying color changer data.
Version: 1.0
Author: Twój Autor
*/

// Enqueue scripts
function enqueue_color_changer() {
    wp_enqueue_script('color-changer', plugin_dir_url(__FILE__) . 'js/my-ajax-script.js', array('jquery'), null, true);
    wp_localize_script('color-changer', 'colorChanger', array('ajax_url' => admin_url('admin-ajax.php')));
}
add_action('wp_enqueue_scripts', 'enqueue_color_changer');

// Save new year function
function save_new_year() {
    // Get data
    $year = intval($_POST['year']);
    $color = sanitize_hex_color($_POST['color']);

    // Get currently saved years
    $years = get_option('color_changer_years', array());

    // Add or update year and color
    $years[$year] = $color;

    // Save data to database
    $saved = update_option('color_changer_years', $years);

    if ($saved) {
        wp_send_json_success('Data saved successfully.');
    } else {
        wp_send_json_error('Error saving data.');
    }
}
add_action('wp_ajax_save_new_year', 'save_new_year');
add_action('wp_ajax_nopriv_save_new_year', 'save_new_year');

// Delete year function
function delete_year() {
    // Get data
    $year = intval($_POST['year']);
    // Get currently saved years
    $years = get_option('color_changer_years', array());

    // Delete year
    if (isset($years[$year])) {
        unset($years[$year]);
        // Save changes
        $saved = update_option('color_changer_years', $years);
        if ($saved) {
            wp_send_json_success('Data deleted successfully.');
        } else {
            wp_send_json_error('Error deleting data.');
        }
    } else {
        wp_send_json_error('Year does not exist.');
    }
}
add_action('wp_ajax_delete_year', 'delete_year');
add_action('wp_ajax_nopriv_delete_year', 'delete_year');

// Display saved years function
function display_saved_years() {
    ?>
    <div class="color-changer-database" style="display:none;">
        <?php
        // Get saved years from database
        $years = get_option('color_changer_years', array());
        foreach ($years as $year => $color) {
            ?>
            <div class="color-changer-chosen-year" data-color="<?php echo esc_attr($color); ?>" data-year="<?php echo esc_attr($year); ?>"></div>
            <?php
        }
        ?>
    </div>
    <?php
}
add_action('wp_footer', 'display_saved_years');
