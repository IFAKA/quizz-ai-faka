import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { getModelParsed } from "../../utils/jsonoutputparser";

import SaveQuizz from "./saveToDb";

const QUIZ_GENERATION_PROMPT =
  "given the text which is a summary of the document, generate a quiz based on the text. Return json only that contains a quizz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL_NAME = "gpt-4-1106-preview";

const getMessage = async (document: Blob) => {
  const loader = new PDFLoader(document as Blob, { parsedItemSeparator: "" });

  const docs = await loader.load();
  const selectedDocs = docs.filter((doc) => doc.pageContent !== undefined);
  const textsFromDocs = selectedDocs.map((doc) => doc.pageContent).join("\n");

  const text = QUIZ_GENERATION_PROMPT + "\n" + textsFromDocs;
  return new HumanMessage({ content: [{ type: "text", text }] });
};

const generateModel = () =>
  new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: MODEL_NAME,
  });

const getAnswer = async (message: HumanMessage) => {
  const unparsedModel = generateModel();
  const model = getModelParsed(unparsedModel);
  const answer = await model.invoke([message]);
  return answer;
};

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY)
    return NextResponse.json(
      { error: "OpenAI API key not provided" },
      { status: 500 }
    );

  const body = await req.formData();
  const document = body.get("pdf") as Blob;

  try {
    const message = await getMessage(document);
    const answer: any = await getAnswer(message);
    const { quizzId } = await SaveQuizz(answer.quizz);

    return NextResponse.json({ quizzId }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
