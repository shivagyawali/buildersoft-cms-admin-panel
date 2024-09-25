import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: "#e0e0e0",
    borderRadius: "50%",
  },
  section: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    marginTop: 20,
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 5,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 5,
    fontWeight: "bold",
  },
});

const PDFInvoice = () => {
  return (
    <Document>
      <Page style={styles.page} size={"A4"}>
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <View style={styles.logo}></View>
        </View>
        
        {/* BuilderSoft Info */}
        <View style={styles.section}>
          <Text>BuilderSoft Inc.</Text>
          <Text>1922 Harvest Lane</Text>
          <Text>New York, NY 12210</Text>
        </View>

        {/* Billing and Shipping Info */}
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
          <View style={styles.section}>
            <Text style={styles.bold}>Bill To</Text>
            <Text>John Smith</Text>
            <Text>2 Court Square</Text>
            <Text>New York, NY 12210</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.bold}>Ship To</Text>
            <Text>John Smith</Text>
            <Text>2 Court Square</Text>
            <Text>New York, NY 12210</Text>
          </View>

          <View>
            <View style={styles.section}>
              <Text>Invoice #</Text>
              <Text>US-001</Text>
            </View>
            <View style={styles.section}>
              <Text>Invoice Date</Text>
              <Text>11/02/2024</Text>
            </View>
            <View style={styles.section}>
              <Text>P.O #</Text>
              <Text>11/02/2024</Text>
            </View>
            <View style={styles.section}>
              <Text>Due Date</Text>
              <Text>11/02/2024</Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Unit Price</Text>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>1</Text>
            <Text style={styles.tableCell}>Some Data here</Text>
            <Text style={styles.tableCell}>100 USD</Text>
            <Text style={styles.tableCell}>100 USD</Text>
          </View>
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}>Total</Text>
            <Text style={styles.tableCell}>100 USD</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFInvoice;
