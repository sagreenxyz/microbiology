import json
import os
import re
from pathlib import Path
from collections import defaultdict

def create_combined_questions():
    # Assuming the script is in /root/microbiology/
    # Input directory is ./subjects/microbiology/ relative to the script
    script_dir = Path(__file__).parent
    input_base_dir = script_dir / 'subjects' / 'microbiology'
    output_file_path = script_dir / 'combined_microbiology_questions.json'

    all_chapters_data = defaultdict(list)
    processed_files_count = 0
    processed_questions_count = 0

    # Find all JSON files in the input directory and subdirectories
    for file_path in input_base_dir.rglob('*.json'):
        # Extract chapter number from filename, e.g., "microbiology-chapter-04.json" -> "04"
        match = re.search(r'chapter-(\d+)', file_path.stem, re.IGNORECASE)
        if not match:
            # Alternative: try to get chapter from parent directory name if it's numeric
            if file_path.parent.name.isdigit():
                chapter_num = file_path.parent.name
            else:
                print(f"Warning: Could not determine chapter number for {file_path}. Skipping.")
                continue
        else:
            chapter_num = match.group(1)


        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            processed_files_count += 1
            current_file_questions = 0

            if 'questions' in data and isinstance(data['questions'], list):
                for q_orig in data['questions']:
                    q_type = q_orig.get('type')
                    if q_type in ["multiple-choice", "true-false"]:
                        q_new = {
                            "question_number": q_orig.get('id'),
                            "type": q_type,
                            "question_text": q_orig.get('text'),
                            "correct_answer": q_orig.get('answer'),
                            "explanation": q_orig.get('explanation')
                        }
                        if q_type == "multiple-choice" and 'options' in q_orig:
                            q_new['options'] = q_orig['options']
                        
                        # Ensure all essential fields were found
                        if None not in (q_new["question_number"], q_new["question_text"], q_new["correct_answer"]):
                           all_chapters_data[chapter_num].append(q_new)
                           current_file_questions +=1
                        else:
                            print(f"Warning: Skipping question with missing essential fields in {file_path}: ID {q_orig.get('id')}")
            if current_file_questions > 0:
                processed_questions_count += current_file_questions
                # print(f"Processed {current_file_questions} questions from {file_path} for chapter {chapter_num}")


        except json.JSONDecodeError:
            print(f"Warning: Could not decode JSON from {file_path}. Skipping.")
        except Exception as e:
            print(f"Warning: An error occurred while processing {file_path}: {e}. Skipping.")

    if not all_chapters_data:
        print("No questions found or processed. Output file will not be created.")
        return

    # Prepare the final output structure
    output_data = {
        "textbooks": [
            {
                "title": "Combined",
                "questions": []
            }
        ]
    }

    # Sort chapters by chapter number (as string, e.g., "01", "02", "10")
    for chapter_num_str in sorted(all_chapters_data.keys()):
        # Get all questions collected for this chapter
        questions_from_chapter = all_chapters_data[chapter_num_str]

        # Sort these questions based on their original 'id' (which is currently stored in 'question_number')
        # This ensures a consistent order before re-numbering.
        # The original 'id' (q_new['question_number']) is guaranteed not to be None by a prior check.
        sorted_original_questions = sorted(questions_from_chapter, key=lambda q: q['question_number'])

        renumbered_review_questions = []
        for i, q_data in enumerate(sorted_original_questions):
            # Create a copy of the question data
            processed_q = q_data.copy()
            # Re-assign question_number sequentially starting from 1 for the current chapter
            processed_q['question_number'] = i + 1

            # Add options for true-false questions
            if processed_q.get('type') == 'true-false':
                processed_q['options'] = ["true", "false"]
            
            renumbered_review_questions.append(processed_q)
        
        chapter_entry = {
            "chapter": chapter_num_str,
            "review_questions": renumbered_review_questions # Use the renumbered list
        }
        output_data["textbooks"][0]["questions"].append(chapter_entry)

    # Write the combined data to the output file
    try:
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2)
        print(f"\nSuccessfully created combined file: {output_file_path}")
        print(f"Total files processed: {processed_files_count}")
        print(f"Total questions included: {processed_questions_count}")
    except IOError:
        print(f"Error: Could not write to output file {output_file_path}.")

if __name__ == '__main__':
    create_combined_questions()
