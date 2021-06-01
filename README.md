This library Updates your Video title with price Feed for ethereum from Coin Gecko. You can also use the script to custom update your Youtube Title.

usage

mkdir youtube

npm install googleapis --save

npm install google-auth-library --save

git clone https://github.com/gravemind117/youtubeeth.git

visit https://console.cloud.google.com/apis/dashboard and create a new project or use existing.

step 1 go to Credentials > Create Credentials > OAuth Client Id 

step 2 select Application type Desktop App

step 3 Provide a name for App and click Create.

step 4 Go back to dashboard and look for your app in "Auth 2.0 Client IDs" section.

step 5 Download Credentials file by clicking the download symbol and save it in the youtube folder

Now type in command line

node update.js

Visit the link shown in console, then login and copy the code shown once a login is successful and paste it in the console.

Thats it you can now programmatically change your Youtube video Title. If you want to experiment you can create a script.sh file and use as a cron job to run update.js at regular intervals. Beware that Google has a call limit of 50 so you can only update the title 50 times in 24hours.



