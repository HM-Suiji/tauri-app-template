mod drizzle_proxy;
include!(concat!(env!("OUT_DIR"), "/generated_migrations.rs"));

use specta_typescript::Typescript;
use tauri_specta::{ collect_commands, Builder };

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
#[specta::specta]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![greet]);
    let migrations = load_migrations();

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/utils/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder
        ::default()
        .plugin(
            tauri_plugin_sql::Builder
                ::default()
                .add_migrations("sqlite:database.db", migrations)
                .build()
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        // and finally tell Tauri how to invoke them
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            // This is also required if you want to use events
            builder.mount_events(app);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![drizzle_proxy::run_sql])
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_log::Builder::new().level(tauri_plugin_log::log::LevelFilter::Info).build()
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
