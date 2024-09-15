# Open Source Ledger Oslo <img style="transform: translateY(5px)" src="src/img/favicon.svg" alt="Oslo Logo" height="32px">
Oslo (formerly known as Spectrum) is a program that helps you manage your savings by letting you create virtual savings accounts. 
It also allows you to set up standing orders, change its appearance, import/export accounts and many other things. 
Keep in mind that Oslo is not a banking app. It is simply a way for you to keep track of your savings. 
Your account data is saved locally in a SQLite database, so don't use Oslo for any sensitive information.<br>
Oslo is currently available in these 5 languages:
- English
- French
- German
- Japanese
- Spanish
## 🎉 Download From the Microsoft Store 🎉
Version 3.2.0 is available for download from the microsoft store on Windows 10/11 desktop devices.
You can find it under the name [Oslo Finance](https://www.microsoft.com/store/productId/9N26D41H49GF?ocid=pdpshare).

## Main UI
<img src="screenshots/main_ui.png" alt="Main UI"><br><br>
The browser-like navigation bar at the top is for creating new savings accounts and switching between them. The currently selected tab is referred to as the active account. The graph at the top of every account shows you the account balance for the time span you have selected. Below that on the left, you can see the changes made during that time span in a table. In the table header you can find your total account balance and in parentheses the balance change for the selected time span.
## Side Menu
<img src="screenshots/add_transaction.png" alt="Add Transaction"><br><br>
This menu allows you to make basic transaction like adding money to an account or withdrawing it by simply by creating a transaction with a negative amount.
<br><br><img src="screenshots/account_settings.png" alt="Account Settings"><br><br>
Each account has its own name and theme color to tell it apart from other accounts. You can also set whether the balance can go below zero and set up an interest rate. The interest rate is added to your account annually if larger than 0 percent.
## Standing Orders
<img src="screenshots/standing_orders.png" alt="Setting up standing orders"><br><br>
In this menu which can be accessed by clicking the calendar icon in the settings menu of an account, you can manage standing orders for the active account. Standing orders are particularly useful if you have to make recurring payments, or you want to give yourself a monthly allowance. You can use the menu on the left side to create a new standing order or manage the existing ones on the right side.
## Settings
<img src="screenshots/settings.png" alt="Settings"><br><br>
By clicking the icon next to the window resize options you can adjust Oslo's global settings. Here you can also export or import account data, for example when moving to a different device.
## Light Mode
<img src="screenshots/light_mode.png" alt="Light mode"><br><br>
Oslo is in dark mode by default. If you do want a light theme, you can activate it in the global settings.

## Manual Installation
### Linux (RPM)
If you are using a redhat distro like Fedora, download the .rpm and run:
```bash
sudo rpm -i /path/to/package.rpm
```
### Linux (DEB)
If you are using a debian distro like Ubuntu, download the .deb and run:
```bash
sudo apt install /path/to/package.deb
```
### Windows
Installation on Windows is extremely easy. You just download the setup and run it. Keep in mind that the Windows version
has not been code signed and Windows will most likely warn you about running the app.
### Building From Source (Other Platforms)
If your platform is not part of the official releases, you can still use Oslo.
You will need the following things:
- Git
- NPM (or another package manager)
  First clone the repo:
```bash
git clone https://github.com/konstantin-lukas/oslo.git
```
Then navigate to the repo and install dependencies:
```bash
cd oslo
npm install
```
Write a maker config inside `forge.config.ts`.
As you can see it already contains some configurations for Windows and Linux. If you wanted
to build for macOS, you would use `@electron-forge/maker-dmg`. You can find more information
on makers [here](https://www.electronforge.io/config/makers). To use a maker that is not already part of the
dev dependencies you have to install it first using your package manager.
After configuring installing and configuring a maker, you need to run
```bash
npm run package
```
and when that is done
```bash
npm run make
```
There will be a make directory inside the output folder which contains your finished build
which you can install with whichever means your platform uses.

### Building Appx for the Microsoft Store
First run:
```bash
npm run package
```
Then use [electron-windows-store](https://github.com/electron-userland/electron-windows-store) to build
the app for the Microsoft Store using this command:
```bash
electron-windows-store 
--input-directory out/oslo-win32-x64 
--output-directory out/win-store 
--package-version 3.2.0.0 
--package-display-name "Oslo - Open Source Ledger Oslo"
--package-name Oslo 
--publisher CN=[get from partner center] 
--windows-kit "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22000.0\x64" 
--dev-cert cert.pfx 
--assets assets 
--cert-pass your_password 
--publisher-display-name "Konstantin Lukas" 
--identity-name [get from partner center]
```
Before running the above command you might need to generate a dev-cert if you haven't already. You can do that with 
these two commands:
```bash
$cert = New-SelfSignedCertificate -Type Custom -Subject "CN=DevCert" -KeyExportPolicy Exportable -KeySpec Signature -HashAlgorithm SHA256 -CertStoreLocation "Cert:\CurrentUser\My" -KeyLength 2048

$CertPassword = ConvertTo-SecureString -String "<YourPassword>" -Force -AsPlainText

Export-PfxCertificate -Cert $cert -FilePath "C:\path\to\your\certificate.pfx" -Password $CertPassword
```