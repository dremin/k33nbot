'use strict';

function RPIntro(bot, options) {

	// register message event
	this.onNewUser = (member) => {
		this.sendMessage(bot, member);
	}
	
	return this;
}

RPIntro.prototype.sendMessage = function(bot, member) {
	
	/* var msg = `Hey ${member}, welcome to **${member.guild.name}!**
In order to play on K33N RP, you are required to do the following:

**1. Register on <https://k33ngaming.com/forum/register>**
To get started, register on our website. After registration, check your email to validate your account (check your junk mail).

**2. Apply to be whitelisted:** <https://k33ngaming.com/fivem-iam/index.htm> (**Must be logged in to apply!**) Whitelist Applications can take up to 2 weeks to be reviewed by staff.
         -- By donating and \`#support-the-server\` (<https://k33ngaming.com/forum/donate/>) before submitting your application, your application will expedited to within 48 hours!

**3. Request Access to K33N RP CAD (Computer Aided Dispatch):** <https://cad.k33nrp.com>
We use a CAD system on K33N RP. Please follow the format below when requesting access.
\`Name:\` FirstName LastInitial | Example: Holden T
\`Email:\` Enter your email used to register on our website.
\`Identifier:\` Enter any 3 digit number. (DO NOT USE 911).
\`Division:\` Select Civilian
\`Password:\` Create a password for your login.
Click Request Access.

__Note:__ Please allow up to 72 hours for your Request Access to be viewed by the K33N RP staff. 

**4. Change your Discord Nickname on K33N RP (right-click yourself and select Change Nickname) to match the following format: \`FirstName LastInitial\`**
__Example:__ Holden T

**5.** Introduce yourself! Start a new topic and introduce yourself to the K33N Community! - <https://k33ngaming.com/forum/forums/forum/6-introductions/>


__**Important Links**__
__Website__ - <https://k33ngaming.com/forum/fivem/home/>
__Forums__ - <https://k33ngaming.com/forum/forums/forum/75-fivem-k33nrp/>
__K33N Gaming Community Discord__ - https://discord.gg/KDs3V3T
`;
*/
var msg = `Hey ${member}, welcome to **${member.guild.name}!**
In order to play on K33N RP, you are required to do the following:

**1. Register on <https://k33ngaming.com/forum/register>**
To get started, register on our website. After registration, check your email to validate your account (check your junk mail).

**2. Request Access to K33N RP CAD (Computer Aided Dispatch):** <https://cad.k33nrp.com>
We use a CAD system on K33N RP. Please follow the format below when requesting access.
\`Name:\` FirstName LastInitial | Example: Holden T
\`Email:\` Enter your email used to register on our website.
\`Identifier:\` Enter any 3 digit number. (DO NOT USE 911).
\`Division:\` Select Civilian
\`Password:\` Create a password for your login.
Click Request Access.

__Note:__ Please allow up to 72 hours for your Request Access to be viewed by the K33N RP staff.

**3. Install TeamSpeak and TokoVOIP for in-game voice chat:** <https://k33ngaming.com/forum/forums/topic/1525-how-to-use-tokovoip/>

**4. Change your Discord Nickname on K33N RP (right-click yourself and select Change Nickname) to match the following format: \`FirstName LastInitial\`**
__Example:__ Holden T

**5.** Introduce yourself! Start a new topic and introduce yourself to the K33N Community! - <https://k33ngaming.com/forum/forums/forum/6-introductions/>


__**Important Links**__
__Website__ - <https://k33ngaming.com/forum/fivem/home/>
__Forums__ - <https://k33ngaming.com/forum/forums/forum/75-fivem-k33nrp/>
__K33N Gaming Community Discord__ - https://discord.gg/KDs3V3T
`;
	
	member.send(msg);
}

module.exports = RPIntro;
