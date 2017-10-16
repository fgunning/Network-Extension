# Network Chart
This repo contains a .twbx file built in Tableau Desktop 10.5.  The workbook contains a sample dataset, viz, and D3 Network Chart build using the extensions API.  The purpose of this repo is not to build a fully reusable plugin, but to show what is easily possible using the new Extensions API in Tableau.

# Installing the Add-In

### Download and install Tableau Desktop (with the Extensions API)

Download and install the Extensions API version of Tableau Desktop from the [Tableau Extensions API Developer Preview](https://prerelease.tableau.com/home.html?welcome) site. Under Resources, click Extensions API Software Downloads.

### Download and install the Network Chart manifest file

Download the Dynamic Parameter manifest file. To make the extension available in Tableau, you need to place the manifest file in an Extensions folder in the My Tableau Repository (Beta) folder (for example, c:\User\Name\Documents\My Tableau Repository (Beta)\Extensions). The extension will appear on a dashboard sheet, under Extensions.

# Using the Add-In
1. Download the attached workbook (NetworkChart.twbx).
2. Drag the extension to your dashboard.
3. Interact with your dashboard.  Selections and filter changes will both trigger new viz renderings.
