import { Image, StyleSheet, Platform, Text, View } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import styled from "styled-components/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

const Table = styled.View`
  width: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 2px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  align-items: center;
`;

const Superscript = styled.Text`
  font-size: 12px;
  vertical-align: top;
  position: relative;
  top: -2px;
`;

const Amount = ({ amount }: { amount: number }) => {
  const dollars = Math.floor(amount);
  const cents = (amount.toString().split(".")[1] || "00").padEnd(2, "0");
  const negative = amount < 0;
  const color = negative ? "inherit" : Colors.spearmint;

  return (
    <ThemedText style={{ color }}>
      {negative && "-"}
      <Superscript>$</Superscript>
      {Math.abs(dollars)}
      <Superscript>{cents}</Superscript>
    </ThemedText>
  );
};

const CompactDate = ({ date }: { date: Date }) => {
  return (
    <ThemedText style={{ fontSize: 12, lineHeight: 10 }}>
      <ThemedText style={{ fontSize: 9, lineHeight: 8 }}>
        {date.toLocaleDateString("en-US", { month: "short" })}
      </ThemedText>
      {"\n"}
      {date.toLocaleDateString("en-US", { day: "2-digit" })}
    </ThemedText>
  );
};

const transactions = [
  {
    date: new Date("2023-01-01"),
    store: "Publix",
    amount: -100,
    category: "Groceries",
  },
  {
    date: new Date("2023-01-02"),
    store: "Amazon",
    amount: -200.1,
    category: "Shopping",
  },
  {
    date: new Date("2023-01-03"),
    store: "GrubHub",
    amount: -150.11,
    category: "Restaurants",
  },
  {
    date: new Date("2023-01-04"),
    store: "Walmart",
    amount: -250.12,
    category: "Groceries",
  },
  {
    date: new Date("2023-01-05"),
    store: "SP Levain Bakery",
    amount: 350.13,
    category: "Restaurants",
  },
  {
    date: new Date("2023-01-06"),
    store: "Thornebrook Chocolates",
    amount: -400.14,
    category: "Shopping",
  },
  {
    date: new Date("2023-01-07"),
    store: "Hardees",
    amount: -450.15,
    category: "Restaurants",
  },
  {
    date: new Date("2024-01-08"),
    store: "Open Roads",
    amount: -500.16,
    category: "Fuel",
  },
  {
    date: new Date("2024-01-09"),
    store: "Tractor Supply Company",
    amount: -550.17,
    category: "Shopping",
  },
  {
    date: new Date("2024-01-10"),
    store: "ALLEY GATORZ",
    amount: 600.18,
    category: "Amusement",
  },
];

const TransactionTable = () => {
  const color = useThemeColor({}, "text");

  const Cell = styled.Text<{ flex?: number }>`
    padding: 8px;
    color: ${color};
    flex: ${(props) => props.flex || 0};
  `;

  const Category = styled.Text`
    font-size: 12px;
    color: #888;
  `;

  return (
    <Table>
      {transactions.map((transaction, index) => (
        <Row key={index}>
          <Cell>
            <CompactDate date={transaction.date} />
          </Cell>
          <Cell flex={1}>
            <View>
              <Text>{transaction.store}</Text>
              <Category>{transaction.category}</Category>
            </View>
          </Cell>
          <Cell>
            <Amount {...{ amount: transaction.amount }} />
          </Cell>
        </Row>
      ))}
    </Table>
  );
};

export default function HomeScreen() {
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
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedText type="subtitle">Transactions</ThemedText>
        <TransactionTable />
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
