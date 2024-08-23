import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    padding: 30,
    fontSize: 12,
    color: "#333",
    backgroundColor: "#f0f4f8", // Light blue-gray background
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 5,
  },
  logo: {
    width: 120,
    height: 50,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a5f7a", // Dark teal color for Haresh Agro Industries
    marginBottom: 5,
  },
  companyAddress: {
    color: "#555",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a5f7a",
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: { flexDirection: "row" },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableCell: { padding: 8 },
  tableHeader: {
    backgroundColor: "#1a5f7a",
    color: "#ffffff",
    fontWeight: "bold",
  },
  tableHeaderCell: {
    padding: 8,
    color: "#ffffff",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    paddingTop: 5,
    paddingBottom: 5,
  },
  totalLabel: {
    width: "60%",
    textAlign: "right",
    paddingRight: 10,
  },
  totalAmount: {
    width: "40%",
    textAlign: "right",
  },
  totalBold: {
    fontWeight: "bold",
    borderTopWidth: 1,
    borderTopColor: "#1a5f7a",
    marginTop: 5,
    paddingTop: 5,
  },
  notes: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#1a5f7a",
  },
  noteText: {
    color: "#555",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#555",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatAmountIndian = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Invoice = ({ invoice, user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          src="https://via.placeholder.com/120x50.png?text=Your+Logo"
        />
        <Text style={styles.companyName}>{user.name}</Text>
        <Text style={styles.companyAddress}>{user.address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To</Text>
        <Text>{invoice.customerName}</Text>
        <Text>{invoice.customerAddress}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ship To</Text>
        <Text>{invoice.shippingAddress}</Text>
      </View>

      <View style={styles.section}>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Invoice Number: </Text>
          {invoice.invoiceNumber}
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Invoice Date: </Text>
          {formatDate(invoice.invoiceDate)}
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Terms: </Text>
          {invoice.terms}
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>GST Number: </Text>
          {user.gstNumber}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeaderCell}>Sr. No.</Text>
          </View>
          <View style={[styles.tableCol, { width: "40%" }]}>
            <Text style={styles.tableHeaderCell}>Item & Description</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeaderCell}>Qty</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeaderCell}>Rate</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeaderCell}>Amount</Text>
          </View>
        </View>
        {invoice.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{index + 1}</Text>
            </View>
            <View style={[styles.tableCol, { width: "40%" }]}>
              <Text style={styles.tableCell}>{item.itemName}</Text>
              <Text
                style={[styles.tableCell, { color: "#6b7280", fontSize: 10 }]}
              >
                {item.itemDescription}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.quantity}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {formatAmountIndian(item.rate)}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {formatAmountIndian(item.amount)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.totalSection}>
        <View style={{ width: "50%" }}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sub Total</Text>
            <Text style={styles.totalAmount}>
              {formatAmountIndian(
                invoice.items.reduce((acc, item) => acc + item.amount, 0)
              )}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>CGST</Text>
            <Text style={styles.totalAmount}>
              {formatAmountIndian(invoice.cgst)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SGST</Text>
            <Text style={styles.totalAmount}>
              {formatAmountIndian(invoice.sgst)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IGST</Text>
            <Text style={styles.totalAmount}>
              {formatAmountIndian(invoice.igst)}
            </Text>
          </View>
          <View style={[styles.totalRow, styles.totalBold]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {formatAmountIndian(invoice.totalAmount)}
            </Text>
          </View>
          <View style={[styles.totalRow, styles.totalBold]}>
            <Text style={styles.totalLabel}>Balance Due</Text>
            <Text style={styles.totalAmount}>
              {formatAmountIndian(invoice.totalAmount)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.notes}>Notes</Text>
        <Text style={styles.noteText}>
          Thank you for your business. We appreciate your prompt payment.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>
          Invoice generated by {user.name} | www.{user.name}.com | +91{" "}
          {user.phonenumber}
        </Text>
      </View>
    </Page>
  </Document>
);

export default Invoice;
