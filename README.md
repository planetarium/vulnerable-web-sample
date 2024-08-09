# Voucher Sample Web

> **Warning**: This project intentionally contains security vulnerabilities. Do not use this code as a reference for secure coding practices.

## Overview

"Voucher Sample Web" is a web application that demonstrates a simple voucher management system. Users can obtain and use vouchers to convert their Gold into USD. The application supports user registration, login, voucher issuance by administrators, and currency conversion functionalities.

## Features

1. **User Registration**
   - New users can create an account to access the application's features.

2. **Login**
   - Existing users can log in to manage their vouchers and account balance.

3. **Voucher Issuance (Admin Only)**
   - Administrators can issue vouchers to specific users.
   - Each voucher contains a specified amount of Gold.

4. **Voucher Usage**
   - Users can redeem issued vouchers to receive Gold in their accounts.

5. **Gold Withdrawal**
   - Users can withdraw their Gold balance by converting it to USD.

## Description

- **Gold Acquisition**: Users can acquire Gold by redeeming vouchers. Each voucher contains a certain amount of Gold that the user can add to their account.
- **Currency Conversion**: Users can convert their Gold balance into USD and withdraw it, effectively utilizing their voucher-based earnings.
- **Voucher Issuance by Admins**: Administrators have the ability to issue vouchers to any user. These vouchers can specify the amount of Gold they contain, allowing administrators to control the distribution of virtual currency within the application.

## Disclaimer

This project contains deliberate security vulnerabilities and should not be used as a guide for secure application development. The vulnerabilities are present for educational purposes to illustrate potential weaknesses in web application security.

---

**Note**: The "Voucher Sample Web" application is intended for educational use only. Use at your own risk.

## How to Run Locally

```bash
yarn
prisma generate
yarn dev
```
