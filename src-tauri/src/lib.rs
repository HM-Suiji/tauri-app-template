mod drizzle_proxy;
include!(concat!(env!("OUT_DIR"), "/generated_migrations.rs"));

use specta_typescript::Typescript;
use tauri_specta::{ collect_commands, Builder };

#[tauri::command]
#[specta::specta]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let tauri_builder = tauri::Builder::default();

    let commands_builder = Builder::<tauri::Wry>
        ::new()
        .commands(collect_commands![greet, drizzle_proxy::run_sql]);
    let migrations = load_migrations();

    #[cfg(debug_assertions)]
    commands_builder
        .export(Typescript::default(), "../src/utils/bindings.ts")
        .expect("Failed to export typescript bindings");

    #[allow(unused_mut)]
    let mut log_plugin_builder = tauri_plugin_log::Builder
        ::new()
        .level(tauri_plugin_log::log::LevelFilter::Info);

    #[cfg(debug_assertions)]
    {
        log_plugin_builder = log_plugin_builder.skip_logger();
    }

    let tauri_builder = tauri_builder
        .plugin(
            tauri_plugin_sql::Builder
                ::default()
                .add_migrations("sqlite:database.db", migrations)
                .build()
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(commands_builder.invoke_handler())
        .setup(move |app| {
            commands_builder.mount_events(app);
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(log_plugin_builder.build());

    #[cfg(debug_assertions)]
    let tauri_builder = tauri_builder.plugin(tauri_plugin_devtools::init());

    tauri_builder.run(tauri::generate_context!()).expect("error while running tauri application");
}
