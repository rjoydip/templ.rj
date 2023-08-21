extern crate lcov_parser;

use lcov_parser::merge_files;
use std::fs;

fn main() {
    let trace_files = [
        "../../../packages/config/coverage/lcov.info",
        "../../../packages/core/coverage/lcov.info",
        "../../../packages/utils/coverage/lcov.info",
    ];
    let directory_path = "../../../coverage/merged_report.lcov".to_string(); // Replace with the desired directory path

    // Attempt to create the directory path
    match fs::create_dir_all(directory_path.clone()) {
        Ok(_) => {
            println!("Directory path '{}' created.", directory_path);
            let _ = match merge_files(&trace_files) {
                Ok(report) => {
                    match report.save_as(directory_path.clone()) {
                        Ok(_) => {
                            // Successfully saved the report
                            println!("Report saved successfully.");
                        }
                        Err(err) => {
                            // Handle the error
                            eprintln!("Error saving report: {}", err);
                        }
                    }
                }
                Err(err) => eprintln!("Error merge files: {}", err),
            };
        }
        Err(err) => eprintln!("Error creating directory path: {}", err),
    }
}
