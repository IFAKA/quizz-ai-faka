import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

const parser = new JsonOutputFunctionsParser();
const extractionFunctionSchema = {
    name: "extractor",
    description: "Extracts fields from the output",
    parameters: {
        type: "object",
        properties: {
            quizz: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    questions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                questionText: { type: "string" },
                                answers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            answerText: { type: "string" },
                                            isCorrect: { type: "boolean" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
export const getModelParsed = (model: ChatOpenAI<ChatOpenAICallOptions>) => model
    .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
    })
    .pipe(parser);