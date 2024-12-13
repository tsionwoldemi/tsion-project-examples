import { UserManager } from 'oidc-client-ts';

// Cognito Configuration
const cognitoAuthConfig = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-****",
    client_id: "*****", // Add your Cognito App Client ID
    redirect_uri: "https://****.cloudfront.net", // Callback URL
    response_type: "code",
    scope: "email openid phone"
};

// UserManager instance
export const userManager = new UserManager(cognitoAuthConfig);

// Sign-out redirect
export async function signOutRedirect() {
    const clientId = "****"; // Add your Cognito App Client ID
    const logoutUri = "https://www.tsionhw.com/";
    const cognitoDomain = "https://us-east-****.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
}

// DOM Elements
const signinButton = document.getElementById('signIn');
const signoutButton = document.getElementById('signOut');
const userInfo = document.getElementById('user-info');

// Update UI function
function updateUI(user) {
    if (user) {
        document.getElementById('email').textContent = user.profile?.email || "N/A";
        document.getElementById('access-token').textContent = user.access_token || "N/A";
        document.getElementById('id-token').textContent = user.id_token || "N/A";
        document.getElementById('refresh-token').textContent = user.refresh_token || "N/A";

        userInfo.style.display = 'block';
        signinButton.style.display = 'none';
        signoutButton.style.display = 'inline-block';
    } else {
        userInfo.style.display = 'none';
        signinButton.style.display = 'inline-block';
        signoutButton.style.display = 'none';
    }
}

// Handle Sign-In
signinButton.addEventListener('click', async () => {
    await userManager.signinRedirect();
});

// Handle Sign-Out
signoutButton.addEventListener('click', async () => {
    await signOutRedirect();
});

// Process authentication callback
if (window.location.pathname === "/callback") {
    userManager.signinRedirectCallback().then(user => {
        updateUI(user);
        window.location.href = "/"; // Redirect to the main page
    }).catch(error => {
        console.error("Sign-in callback error:", error);
    });
}

// Check if user is already signed in
userManager.getUser().then(user => {
    updateUI(user);
}).catch(error => {
    console.error("Error checking user sign-in status:", error);
    updateUI(null);
});
