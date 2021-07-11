<img src="favicon.svg" alt="Spectrum Logo" width="50%">

# Spectrum
Spectrum is a program that helps you manage your savings by letting you create virtual savings accounts. Spectrum also allows you to set up standing orders, change its appearance, import/export accounts and many other things. Keep in mind that Spectrum is not a banking app. It is simply a way for you to keep track of your savings. Your account data is saved locally in a JSON file, so don't use Spectrum for any sensitive information. The packaged release is available on SourceForge. Alternatively, you can use the unpackaged project by cloning this project and starting the *appstart.bat* file or running `npm start` in the console. Please note that dependencies have omitted due to file size restriction on GitHub. Make sure you install all dependencies from the package.json file, but I really recommend for users to just go with the packaged release.
<br><br>
[![Download Spectrum Savings Accounts](https://a.fsdn.com/con/app/sf-download-button)](https://sourceforge.net/projects/spectrum-savings-accounts/files/latest/download)
## Main UI
<img src="screenshots/main_ui.png" alt="Main UI"><br><br>
The browser-like navigation bar at the top is for creating new savings accounts and switching between them. The currently selected tab is referred to as the active account. The graph at the top of every account shows you the account balance for the time span you have selected. Below that on the left, you can see the changes made during that time span in a table. In the table header you can find your total account balance and in parenthesis the balance change for the selected time span.
## Side Menu
<img src="screenshots/side_ui.png" alt="Side UI"><br><br>
This menu which can be found on the right side below the balance chart is used for two things. The upper part labeled "transaction" is for depositing or withdrawing money from the active account. The lower part is for changing an accounts settings. If you click the trash can icon you can delete an account. If you click the calendar icon, you can set up and manage standing orders for the active account.
### Interest rate
This percentage is multiplied with your account balance at the end of every year and the resulting sum is added to your account.
### Theme color
Setting different theme colors for your account makes it easier to tell them apart quickly and also allows you to customize Spectrum to your liking.
### Overdrawing
Spectrum allows you to decide whether you want to allow overdrawing. If enabled, an account's balance is unable to go below 0.
## Standing Orders
<img src="screenshots/standing_orders.png" alt="Setting up standing orders"><br><br>
In this menu which can be accessed by clicking the calendar icon in the settings menu of an account, you can manage standing orders for the active account. Standing orders are particularly useful if you have to make recurring payments or you want to give yourself a monthly allowance. You can use the menu on the left side to create a new standing order or manage the existing ones on the right side.
## Settings
<img src="screenshots/settings.png" alt="Settings"><br><br>
By clicking the icon next to the window resize options you can adjust Spectrum's global settings. Here you can also export or import account data, for example when updating to a newer version.
## Light Mode
<img src="screenshots/light_mode.png" alt="Light mode"><br><br>
Spectrum is in dark mode by default. If you do want a light theme, you can activate it in the global settings.
## Languages
<img src="screenshots/language.png" alt="Languages"><br><br>
Spectrum is available in 5 languages. Currently available are English, German, Spanish, French, and Japanese.
