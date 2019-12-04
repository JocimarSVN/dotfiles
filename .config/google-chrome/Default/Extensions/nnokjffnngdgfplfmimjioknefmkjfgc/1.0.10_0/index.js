
chrome.app.runtime.onLaunched.addListener( function(launchData) {
  console.log('Launching ChromeApp. Source: ' + launchData.source);

  if (launchData && launchData.source == "app_launcher") {
    window.open("https://simet.nic.br/simet-app.html");
  }

  if(! window.installerBackend){
    console.log('Provision InstallerBackend.');
    window.installerBackend = new InstallerBackend();
  }

  if(! window.eventPage){
    console.log('Provision EventPage.');
    window.eventPage = new EventPage();
  }
});
