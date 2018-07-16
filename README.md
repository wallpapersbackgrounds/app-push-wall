This guide will show you how to send push notifications with the help of Azure Notification Hubs directly from a Node.js application.
The scenarios covered include sending push notifications to applications on the following platforms:
>>>>Android

>>What are Notification Hubs?
Azure Notification Hubs provide an easy-to-use, multi-platform, scalable infrastructure for sending push notifications to mobile devices. For details on the service infrastructure, see the Azure Notification Hubs page.
>>Create a Node.js Application
The first step in this tutorial is creating a new blank Node.js application. For instructions on creating a Node.js application, see Create and deploy a Node.js application to Azure Web Site, Node.js Cloud Service using Windows PowerShell, or Web Site with WebMatrix.
>>Configure Your Application to Use Notification Hubs
To use Azure Notification Hubs, you need to download and use the Node.js azure package, which includes a built-in set of helper libraries that communicate with the push notification REST services.
>>Use Node Package Manager (NPM) to obtain the package

Use a command-line interface such as PowerShell (Windows), Terminal (Mac), or Bash (Linux) and navigate to the folder where you created your blank application.
>>>Type npm install azure-sb in the command window.
You can manually run the ls or dir command to verify that a node_modules folder was created. Inside that folder, find the azure package, which contains the libraries you need to access the Notification Hub.
Note

You can learn more about installing NPM on the official NPM blog.
Import the module

Using a text editor, add the following to the top of the server.js file of the application:


>>>>var azure = require('azure');


>>Setup an Azure Notification Hub connection

The NotificationHubService object lets you work with notification hubs. The following code creates a NotificationHubService object for the nofication hub named hubname. Add it near the top of the server.js file, after the statement to import the azure module:


>>>>var notificationHubService = azure.createNotificationHubService('hubname','connectionstring');



The connection connectionstring value can be obtained from the Azure Portal by performing the following steps:
In the left navigation pane, click Browse.
Select Notification Hubs, and then find the hub you wish to use for the sample. You can refer to the Windows Store Getting Started tutorial if you need help creating a new Notification Hub.
Select Settings.
Click on Access Policies. You will see both shared and full access connection strings.
>>Azure Portal - Notification Hubs


You can also retrieve the connection string using the Get-AzureSbNamespace cmdlet provided by Azure PowerShell or the azure sb namespace show command with the Azure Command-Line Interface (Azure CLI).
General architecture
The NotificationHubService object exposes the following object instances for sending push notifications to specific devices and applications:
Android - use the GcmService object, which is available at notificationHubService.gcm





>>How to: Send push notifications to Android applications

The GcmService object provides a send method that can be used to send push notifications to Android applications. The send method accepts the following parameters:
>Tags - the tag identifier. If no tag is provided, the notification will be sent to all clients.
>Payload - the message's JSON or raw string payload.
>Callback - the callback function.
For more information on the payload format, see the Payload section of the Implementing GCM Server document.
The following code uses the GcmService instance exposed by the NotificationHubService to send a push notification to all registered clients.




>>>>
var payload = {
  data: {
    message: 'Hello!'
  }
};
notificationHubService.gcm.send(null, payload, function(error){
  if(!error){
    //notification sent
  }
});







