import { View } from "react-native";
import styled from "styled-components/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";

const Table = styled.View`
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  padding: 8px 0;
`;

const DateCell = styled.View`
  flex-shrink: 1;
  justify-content: center;
  align-items: left;
  padding-right: 8px;
`;

const MiddleCell = styled.View`
  flex: 1;
  justify-content: center;
  padding-right: 8px;
  padding-bottom: 4px;
`;

const AmountCell = styled.Text`
  flex-shrink: 1;
  justify-content: center;
  align-items: flex-end;
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
  const color = negative ? useThemeColor({}, "text") : Colors.spearmint;

  return (
    <View>
      <ThemedText style={{ color }}>
        {negative && "-"}
        <Superscript>$</Superscript>
        {Math.abs(dollars)}
        <Superscript>{cents}</Superscript>
      </ThemedText>
    </View>
  );
};

const CompactDate = ({ date }: { date: Date }) => {
  return (
    <ThemedText style={{ fontSize: 14, lineHeight: 12, letterSpacing: 0.5 }}>
      <ThemedText style={{ fontSize: 11, lineHeight: 11, letterSpacing: -0.8 }}>
        {date.toLocaleDateString("en-US", { month: "short" })}
      </ThemedText>
      {"\n"}
      {date.toLocaleDateString("en-US", { day: "2-digit" })}
    </ThemedText>
  );
};

export type Transaction = {
  id: string;
  date: Date;
  store: string;
  amount: number;
  category: string;
};

export const TransactionTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const color = useThemeColor({}, "text");

  const Category = styled.Text`
    font-size: 12px;
    color: #888;
    line-height: 12px;
  `;

  return (
    <Table>
      {transactions.map((transaction, index) => (
        <Row key={index}>
          <DateCell>
            <CompactDate date={transaction.date} />
          </DateCell>
          <MiddleCell>
            <View>
              <ThemedText style={{ lineHeight: 16 }}>
                {transaction.store}
              </ThemedText>
              <Category>{transaction.category}</Category>
            </View>
          </MiddleCell>
          <AmountCell>
            <Amount {...{ amount: transaction.amount }} />
          </AmountCell>
        </Row>
      ))}
    </Table>
  );
};
