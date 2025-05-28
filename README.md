# Quiz File JSON Schema

This document describes the JSON schema used for the quiz files in this project.

## Root Object

The root of the JSON file is an object with the following properties:

- `title` (string): The title of the quiz.
- `questions` (array): An array of question objects.

## Question Object

Each object within the `questions` array represents a single quiz question and has the following properties:

- `id` (number): A unique identifier for the question. (Note: This field may sometimes be absent).
- `type` (string): The type of question. Possible values include:
    - `"multiple-choice"`: The user must select a single correct answer from a list of options.
    - `"select all that apply"`: The user can select multiple correct answers from a list of options.
    - `"true-false"`: The user must determine if a statement is true or false.
    - `"fill-in-the-blank"`: The user must provide a word or phrase to complete a statement.
    - `"short-answer"`: The user must provide a brief textual answer.
    - `"critical-thinking"`: The user must provide a more detailed, reasoned textual answer.
- `text` (string): The text of the question. (Note: This field may sometimes be absent for non-question entries).
- `options` (array of strings): An array containing the possible answer choices. This field is primarily used for `"multiple-choice"` and `"select all that apply"` question types. For other types, it is often omitted.
- `answer` (string or array of strings): The correct answer(s) for the question. The format depends on the question `type`:
    - For `"multiple-choice"` questions, this is a string representing the correct answer. This string must be one of the values present in the `options` array.
    - For `"select all that apply"` questions, this is an array of strings, where each string is a correct answer. Each string in this array must be one of the values present in the `options` array.
    - For `"true-false"` questions, this is a string, typically `"true"` or `"false"`.
    - For `"fill-in-the-blank"` questions, this is an array of strings, representing acceptable answers.
    - For `"short-answer"` questions, this is a string containing the correct answer.
    - For `"critical-thinking"` questions, this is a string containing the model answer.
    (Note: This field may sometimes be absent, especially for open-ended questions where the `explanation` field provides guidance).
- `explanation` (string): A brief explanation of why the answer is correct, or further information related to the question.
- `imageUrl` (string, optional): A URL to an image relevant to the question.

## Example

```json
{
  "title": "Sample Quiz Title",
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "text": "What is the capital of France?",
      "options": [
        "Berlin",
        "Madrid",
        "Paris",
        "Rome"
      ],
      "answer": "Paris",
      "explanation": "Paris is the capital and most populous city of France."
    },
    {
      "id": 2,
      "type": "select all that apply",
      "text": "Which of the following are primary colors?",
      "options": [
        "Red",
        "Green",
        "Blue",
        "Yellow"
      ],
      "answer": [
        "Red",
        "Blue",
        "Yellow"
      ],
      "explanation": "The primary colors in the RYB color model are red, yellow, and blue."
    },
    {
      "id": 3,
      "type": "true-false",
      "text": "The Earth is flat.",
      "answer": "false",
      "explanation": "The Earth is an oblate spheroid, meaning it is round but slightly flattened at the poles and bulging at the equator."
    },
    {
      "id": 4,
      "type": "fill-in-the-blank",
      "text": "The capital of Japan is ___",
      "answer": ["Tokyo"],
      "explanation": "Tokyo has been the capital of Japan since 1869."
    },
    {
      "id": 5,
      "type": "short-answer",
      "text": "What is the chemical symbol for water?",
      "answer": "H2O",
      "explanation": "Water is composed of two hydrogen atoms covalently bonded to one oxygen atom."
    },
    {
      "id": 6,
      "type": "critical-thinking",
      "text": "Discuss the impact of climate change on global sea levels.",
      "answer": "As the climate warms, polar ice melts and seawater expands, leading to higher sea levels. This can result in coastal flooding, loss of habitat for plants, animals, and even humans, and increased salinity in estuaries and aquifers.",
      "explanation": "Understanding the consequences of climate change is crucial for developing strategies to mitigate its impact."
    }
  ]
}
```
