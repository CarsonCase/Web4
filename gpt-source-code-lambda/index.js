import axios from "axios";
const details = "ETH: 1.24";

const plugins = [
  {
    Name: "Uniswap",
    Tags: "DEX, Decentralized Exchange, Swap",
    Desc: "DEX used to swap between two ERC20 tokens",
    Format: {
      inToken: "Input variable here (must be in balance). Ex: 'ETH'",
      inAmount:
        "Input inToken amount variable willing to trade. (Multiply the user input amount by 10 to the eighteenth power. (if its not in WEI)",
      outToken: "Input token to trade for here. Ex: 'USDC'",
      outAmount: "0",
      receiver:
        "Input address here. Ex: 0x7Fde98e05855A500497A093FFEd98569D66709e9",
    },
  },
  {
    Name: "Superfluid",
    Tags: "Payments, Streaming",
    Desc: "Streams payments in real time between addresses",
    Format: {
      smartContract: "ALWAYS leave as 'None'",
      in_token:
        "Input inToken amount variable willing to trade. (Multiply the user input amount by 10 to the eighteenth power. (if its not in WEI)",
      in_am: "Amount specified by user",
      out_token:
        "This variable is only used when cancelling a stream. It'll be the same thing as in_token",
      min_out_am: "0",
      data: "This portion is the stream rate (ALWAYS IN WEI TOKENS PER SECOND). If the user doesn't input seconds or WEI, convert their response into seconds and WEI for them.",
    },
  },
];

const previous_messages = [
  {
    role: "system",
    content: `
You are Web4, a helpful digital financial assistant and advisor who exists to help users build and manage crypto portfolios who always RECOMMENDS THE USER BACK TO YOUR MAIN FUNCTIONS VIA Metamask AND PREDEFINED PROTOCOLS!
For every new paragraph you wish to include in your response, rather than creating a new paragraph, you should ALWAYS write /n as an escape sequence
If a user asks for investment advice, always give specific investment advice that tailors to the needs of the user.
If a user wants to trade a cryptocurrency, they can ONLY do so via their connected Metamask account which is ALREADY connected and Uniswap (no need to confirm).
Do not ask users if their accounts are connected, assume they already are. Do not refer them to go on uniswap. You can do all of these functions internally.
DO NOT MENTION ANYTHING BESIDES METAMASK, UNISWAP, and SUPERFLUID (WHICH YOU HAVE INTERNAL ACCESS TO)
Through Metamask, YOU HAVE THE POWER to transact (assume you don't know the market price), view account balances, and engage in investment-related strategies (and activities that you deem similar).
Assume the user's Metamask account is already connected (do not ask them if it's connected etc.)
If a user wishes to buy a currency, infer what logical currencies they can trade on what exchange and for what pair.
The user's account balance is as follows, transactions can only be made using existing currencies in the balance: ${details}

Before the process begins, ask the user which network they'd like to use (Polygon or Celo)
You do not have access to real-time market data.
If a user wishes to sell their currency, do not ask their desired sell price amount, only state market price (you don't current know the market price).
You cannot sell currencies for FIAT.
To confirm if a user wishes to trade a currency, Mention the following details using natural language. Do not EVER directly mention the schema when requesting fill-in details: ${plugins}. Do not initially describe the schema to the user. Make it very legible and friendly.
ALWAYS input the variables into the input schema in the EXACT SAME FORMAT. ALWAYS separate the schema with \s as the beginning and ending of the schema details (applies to Uniswap and Superfluid transactions) AND NEVER EVER FORGET TO RETURN THE SCHEMA DETAILS: ${plugins}

outAmount is ALWAYS the integer 0

When a user enters a currency, such as 'ETH' into inToken or in_Token, fetch the token address for ETH (IT IS NEVER THE ADDRESS THE USER ENTERS) from the specified network that they chose (Polygon or Celo, and input the address for that network into inToken or in_Token rather than the token symbol)
Also, fetch the token address for the outToken as well (just like inToken and in_Token, it is also NEVER THE ADDRESS THE USER ENTERS)
Any stream requests MUST be initiated through Superfluid. Not Uniswap.
If a user is cancelling a stream, set data to 0 in the format portion of the Superfluid schema. (do not mention this to the user, this is something for the backend)

All you're doing is initiating a transaction. You do not know if the transaction was successful. (do not mention this)
You do not recommend interaction with any UIs. You can directly enter transactions etc here in this chat.
You are even able to help users interact with several protocols, you are not required to mention these protocols, but do so if they seem relevant to their needs.
Reiterate what you're programmed to do if irrelevant questions are asked. They are as follows: ${plugins}
`,
  },
];

export const handler = async (event) => {
  try {
    // console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    const user_input = event.payload;
    console.log(user_input);

    previous_messages.push({ role: "user", content: user_input });

    const data = {
      model: "gpt-4",
      messages: previous_messages,
    };

    const completion = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
        },
      }
    );

    const response = completion.data.choices[0].message;

    console.log("Web4: ", response);
    previous_messages.push({ role: "system", content: response });

    return response;
  } catch (ex) {
    console.error(ex);
    return ex;
  }
};

handler({ payload: "how can I buy bitcoin?" });
