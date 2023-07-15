import { kv } from '@vercel/kv'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const apiKey = "5fdcf214-3d39-494d-a5bd-90679b99ada6";
const url = "https://api.kapa.ai/query/v1";

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const lastMessage = messages[messages.length - 1];
  const query = lastMessage.content;
  let threadId = lastMessage.thread_id; // Assuming thread_id is stored in the message

  const requestOptions = {
    method: "GET",
    headers: {
      "X-API-TOKEN": apiKey
    }
  };

  let res;
  if (threadId) {
    // Use the thread endpoint if a thread_id is present
    res = await fetch(`${url}/thread/${threadId}?query=${encodeURIComponent(query)}`, requestOptions)
  } else {
    // Use the query endpoint if no thread_id is present
    res = await fetch(`${url}?query=${encodeURIComponent(query)}`, requestOptions)
  }

  const data = await res.json();

  console.log(data,"data");

  const title = json.messages[0].content.substring(0, 100)
  const id = json.id ?? nanoid()
  const createdAt = Date.now()
  const path = `/chat/${id}`

  // Split the answer by question and take the last part
  const answerParts = data.answer.split('what are Flow Accounts ?');
  const lastAnswer = answerParts[answerParts.length - 1];

  const payload = {
    id,
    title,
    userId,
    createdAt,
    path,
    messages: [
      ...messages,
      {
        content: lastAnswer.replace(/\\n/g, '\n'), // assuming data.answer is the response from Kapa.ai
        role: 'assistant',
        thread_id: data.thread_id // Store the thread_id in the message
      }
    ]
  }
  await kv.hmset(`chat:${id}`, payload)
  await kv.zadd(`user:chat:${userId}`, {
    score: createdAt,
    member: `chat:${id}`
  })

  // Extract only the content of the messages
  const messageContents = payload.messages.map(msg => msg.content).join('\n');

  return new Response(messageContents, {status: 200})
}



// thread_id: 'd297e09e-2003-4f03-be17-bdcaa7cacdb0',
// question_answer_id: '29f488ff-5a13-4954-b124-c5658073bc85',