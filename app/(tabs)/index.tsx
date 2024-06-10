import { Image, StyleSheet, Platform } from 'react-native';
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import styled from "styled-components/native";
import { useThemeColor } from "@/hooks/useThemeColor";

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
  const color = negative ? "inherit" : "green";

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
  { date: new Date("2023-01-01"), store: "Store A", amount: -100 },
  { date: new Date("2023-01-02"), store: "Company B", amount: -200.1 },
  { date: new Date("2023-01-03"), store: "Store C", amount: -150.11 },
  { date: new Date("2023-01-04"), store: "Company D", amount: -250.12 },
  { date: new Date("2023-01-05"), store: "Store E", amount: 350.13 },
  { date: new Date("2023-01-06"), store: "Company F", amount: -400.14 },
  { date: new Date("2023-01-07"), store: "Store G", amount: -450.15 },
  { date: new Date("2023-01-08"), store: "Company H", amount: -500.16 },
  { date: new Date("2023-01-09"), store: "Store I", amount: -550.17 },
  { date: new Date("2023-01-10"), store: "Company J", amount: 600.18 },
];

const TransactionTable = () => {
  const color = useThemeColor({}, "text");

  const Cell = styled.Text<{ flex?: number }>`
    padding: 8px;
    color: ${color};
    flex: ${(props) => props.flex || 0};
  `;

  return (
    <Table>
      {transactions.map((transaction, index) => (
        <Row key={index}>
          <Cell>
            <CompactDate date={transaction.date} />
          </Cell>
          <Cell flex={1}>{transaction.store}</Cell>
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
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. PressPress{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: "cmd + d", android: "cmd + m" })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
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
    flexDirection: 'row',
    alignItems: 'center',
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
    position: 'absolute',
  },
});
