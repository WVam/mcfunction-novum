const provider = require("./provider.js");
const { setLists } = require("./provider.js");
const shell = require("electron").shell;
const versions = require("./versions.json");

let versionsEnum = versions.map((v,i) =>{return {value:i, description:v.name}});

module.exports = {

	config: {
		enableAutocomplete: {
			title: "Enable Autocomplete",
			description: "Enable mcfunction-novum's autocomplete+ manager",
			type: "boolean",
			default: true,
			order: 1
		},
		showPopup: {
			title: "Show Popup",
			description: "Enable the popup which is shown after startup",
			type: "boolean",
			default: true,
			order: 2
		},
		autocomplete: {
			title: "Autocomplete",
			type: "object",
			order: 3,
			properties: {
				mcVersion: {
					title: "Change Version",
					description: "Change the minecraft version of the autocomplete",
					type: "integer",
					default: versions.length - 1,
					enum: versionsEnum.reverse(),
					order: 1
				},
				iconColor: {
					title: "Icon Color",
					description: "Choose the color of the icons in the suggestion box",
					type: "color",
					default: "#009688",
					order: 2
				},
				showIcons: {
					title: "Show Icons",
					description: "Determines if custom icons are shown in the suggestion box. If this setting is deactivated, characters are used as icons",
					type: "boolean",
					default: true,
					order: 3
				}
			}
		},
		syntaxHighlighting: {
			title: "Syntax Highlighting",
			type: "object",
			order: 4,
			properties: {
				commentOut: {
					title: "Enable Comment Out Highlighting",
					description: "Enable custom highlighting for commenting out",
					type: "boolean",
					default: true,
					order: 1
				}
			}
		}
	},

	activate: () => {
		moveSettings();
		
		try{
			provider.setLists(versions[atom.config.get("mcfunction-novum.autocomplete.mcVersion")].folder);
		} catch (error) {
			provider.setLists(versions[versions.length - 1].folder);
		}

		atom.config.onDidChange("mcfunction-novum.autocomplete.mcVersion", () => {
			setLists(versions[atom.config.get("mcfunction-novum.autocomplete.mcVersion")].folder);
		});

		if(atom.config.get("mcfunction-novum.showPopup")) {
			let notification = atom.notifications.addInfo("mcfunction novum",
				{
					dismissable: true,
					description: "If you find any missing blocks, items, sounds etc. please report it in the repository. Thank you for your help :D",
					buttons: [
						{
							text: "Go to the repository",
							className: "popup-btn",
							onDidClick: () => shell.openExternal('https://github.com/jan00bl/mcfunction-novum')
						},
						{
							text: "Never show this again",
							className: "popup-btn",
							onDidClick: () => {
								atom.config.set("mcfunction-novum.showPopup", false);
								notification.dismiss();
							}
						}
					]
				}
			);
		}

		if(!atom.config.get("mcfunction-novum.latestVersion")) {
			atom.config.set("mcfunction-novum.latestVersion",versions.length);
		}

		if(atom.config.get("mcfunction-novum.latestVersion") < versions.length) {
			let notification = atom.notifications.addInfo("mcfunction-novum",
			{
				dismissable: true,
				description: `The version **${versions[versions.length - 1].name}** has been added to mcfunction-novum.  \nDo you want to switch to this version?  \n  \n(You can always switch back to your old version using the package settings)`,
				buttons: [
					{
						text: "Yes",
						className: "popup-btn",
						onDidClick: () => {
							atom.config.set("mcfunction-novum.autocomplete.mcVersion", versions.length - 1);
							notification.dismiss();
						}
					},
					{
						text: "No",
						className: "popup-btn",
						onDidClick: () => {
							notification.dismiss();
						}
					}
				]
			});
		}
		
		atom.config.set("mcfunction-novum.latestVersion",versions.length);

		setIconColor(atom.config.get("mcfunction-novum.autocomplete.iconColor"));
		atom.config.onDidChange("mcfunction-novum.autocomplete.iconColor", () => {
			setIconColor(atom.config.get("mcfunction-novum.autocomplete.iconColor"));
		});

		setCommentOutHighlighting(atom.config.get("mcfunction-novum.syntaxHighlighting.commentOut"));
		atom.config.onDidChange("mcfunction-novum.syntaxHighlighting.commentOut", () => {
			setCommentOutHighlighting(atom.config.get("mcfunction-novum.syntaxHighlighting.commentOut"));
		});

	},

	getProvider: () => provider
}

function setIconColor(color) {
	let root = document.documentElement;

	root.style.setProperty("--mcfunction-novum-icon-red", color.red);
	root.style.setProperty("--mcfunction-novum-icon-green", color.green);
	root.style.setProperty("--mcfunction-novum-icon-blue", color.blue);
}

function setCommentOutHighlighting(highlight) {
	let color;
	if(highlight) {
		color = getComputedStyle(document.documentElement).getPropertyValue("--mcfunction-novum-comment-out");
	} else {
		color = getComputedStyle(document.documentElement).getPropertyValue("--mcfunction-novum-comment");
	}
	document.documentElement.style.setProperty("--mcfunction-novum-deactivated", color);
}

function moveSettings() {
	let mcVersion = atom.config.get("mcfunction-novum.mcVersion");
	let showIcons = atom.config.get("mcfunction-novum.showIcons");

	if(atom.config.get("mcfunction-novum.mcVersion") != null) {
		atom.config.set("mcfunction-novum.autocomplete.mcVersion", mcVersion);
		atom.config.unset("mcfunction-novum.mcVersion");
	}

	if(atom.config.get("mcfunction-novum.showIcons") != null) {
		atom.config.set("mcfunction-novum.autocomplete.showIcons", showIcons);
		atom.config.unset("mcfunction-novum.showIcons");
	}
}
