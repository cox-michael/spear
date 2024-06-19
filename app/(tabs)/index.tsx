import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import styled from "styled-components/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction, TransactionTable } from "@/components/TransactionTable";

const placeHolderTransactions: Transaction[] = [
  {
    id: generateId(),
    date: new Date("2023-01-01"),
    store: "Publix",
    amount: -100,
    category: "Groceries",
  },
  {
    id: generateId(),
    date: new Date("2023-01-02"),
    store: "Amazon",
    amount: -200.1,
    category: "Shopping",
  },
  {
    id: generateId(),
    date: new Date("2023-01-03"),
    store: "GrubHub",
    amount: -150.11,
    category: "Restaurants",
  },
  {
    id: generateId(),
    date: new Date("2023-01-04"),
    store: "Walmart",
    amount: -250.12,
    category: "Groceries",
  },
  {
    id: generateId(),
    date: new Date("2023-01-05"),
    store: "SP Levain Bakery",
    amount: 350.13,
    category: "Restaurants",
  },
  {
    id: generateId(),
    date: new Date("2023-01-06"),
    store: "Thornebrook Chocolates",
    amount: -400.14,
    category: "Shopping",
  },
  {
    id: generateId(),
    date: new Date("2023-01-07"),
    store: "Hardees",
    amount: -450.15,
    category: "Restaurants",
  },
  {
    id: generateId(),
    date: new Date("2024-01-08"),
    store: "Open Roads",
    amount: -500.16,
    category: "Fuel",
  },
  {
    id: generateId(),
    date: new Date("2024-01-09"),
    store: "Tractor Supply Company",
    amount: -550.17,
    category: "Shopping",
  },
  {
    id: generateId(),
    date: new Date("2024-01-10"),
    store: "ALLEY GATORZ",
    amount: 600.18,
    category: "Amusement",
  },
];

function generateId() {
  return Math.random().toString(36).substring(7);
}

const RetroButton = styled.TouchableOpacity`
  font-size: 14px;
  color: #00ff00; /* Green color, similar to old CRT monitors */
  background-color: black;
  border: 2px solid #00ff00;
  padding: 10px 20px;
  text-transform: uppercase;
  cursor: pointer;
  text-align: center;
  box-shadow: none;
  outline: none;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
`;

const getPublicToken = async ({
  client_id,
  secret,
}: {
  client_id: string;
  secret: string;
}) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    client_id,
    secret,
    institution_id: "ins_20",
    initial_products: ["transactions"],
    options: {
      webhook: "https://www.plaid.com/webhook",
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://sandbox.plaid.com/sandbox/public_token/create",
      requestOptions as RequestInit
    );

    const json = await response.json();

    return json.public_token;
  } catch (error) {
    console.log("error", error);
  }
};

const exchangeToken = async ({
  publicToken,
  client_id,
  secret,
}: {
  publicToken: string;
  client_id: string;
  secret: string;
}) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    client_id,
    secret,
    public_token: publicToken,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://sandbox.plaid.com/item/public_token/exchange",
      requestOptions as RequestInit
    );

    const json = await response.json();

    return json.access_token;
  } catch (error) {
    console.log("error", error);
  }
};

const getPlaidApiKeys = async () => {
  const client_id = await AsyncStorage.getItem("plaidClientId");
  const secret = await AsyncStorage.getItem("plaidSecret");
  let access_token = await AsyncStorage.getItem("plaidAccessToken");

  if (!client_id) {
    throw new Error("Plaid Client ID not found");
  }

  if (!secret) {
    throw new Error("Plaid Secret not found");
  }

  if (!access_token) {
    const publicToken = await getPublicToken({ client_id, secret });
    access_token = await exchangeToken({ publicToken, client_id, secret });
  }

  if (!access_token) {
    throw new Error("Unable to attain Plaid Access Token");
  }

  await AsyncStorage.setItem("plaidAccessToken", access_token);

  return {
    client_id,
    secret,
    access_token,
  };
};

const getTransactions = async () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const { client_id, secret, access_token } = await getPlaidApiKeys();

  if (!access_token) {
    throw new Error("Plaid Access Token not found");
  }

  var raw = JSON.stringify({
    client_id,
    secret,
    access_token,
    start_date: "2023-04-14",
    end_date: "2024-04-17",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://sandbox.plaid.com/transactions/get",
      requestOptions as RequestInit
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("error", error);
  }
};

const formatTransactions = (transactions: any) => {
  return transactions.map((transaction: any) => {
    return {
      id: transaction.transaction_id,
      date: new Date(transaction.date),
      store: transaction.name,
      amount: transaction.amount,
      category: transaction.category?.[0],
    };
  });
};

export default function HomeScreen() {
  const [clicked, setClicked] = useState(false);
  // const [displayData, setDisplayData] = useState("unchanged");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [inputName, setInputName] = useState<string>("");

  const updateTitle = async () => {
    setClicked((prev) => !prev);
    setLoading(true);

    const transactions = await getTransactions();
    const formattedTransactions = formatTransactions(transactions.transactions);
    setTransactions(formattedTransactions);

    setLoading(false);
  };

  const getName = async () => {
    try {
      const value = await AsyncStorage.getItem("name");
      setName(value);
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    getName();
  }, []);

  const storeName = async (value: string) => {
    try {
      await AsyncStorage.setItem("name", value);
      setName(value);
    } catch (e) {
      throw e;
    }
  };

  const welcomeMessage = `Welcome${name ? `, ${name}` : ""}!`;

  const title = clicked ? "Clicked!" : welcomeMessage;

  const transactionsToRender = transactions.length
    ? transactions
    : placeHolderTransactions;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{title}</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <RetroButton onPress={updateTitle}>
          <ThemedText>Load transactions</ThemedText>
        </RetroButton>
        <ThemedText type="title">{loading ? "loading" : null}</ThemedText>
      </ThemedView>

      <ThemedView>
        <ThemedText type="subtitle">Step 1: Enter your name</ThemedText>
        <ThemedText>What's your name?</ThemedText>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setInputName}
          value={inputName}
          placeholder="Enter your name"
        />

        <RetroButton onPress={() => storeName(inputName)}>
          <ThemedText>Store name</ThemedText>
        </RetroButton>
      </ThemedView>

      {/* <ThemedView>
        <ThemedText type="subtitle">returned value</ThemedText>
        <ThemedText>{displayData}</ThemedText>
      </ThemedView> */}

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedText type="subtitle">Transactions</ThemedText>
        <TransactionTable {...{ transactions: transactionsToRender }} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
