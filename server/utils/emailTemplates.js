// utils/emailTemplates.js

export const accountConfirmationWelcomeEmailTemplate = ({ name, url }) => {
  return `
    <div style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <tr>
          <td style="background-color: #16a34a; padding: 24px 0; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">EduConnect</h1>
            <p style="color: #dcfce7; font-size: 14px; margin: 4px 0 0;">A Virtual College Learning Platform</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 32px 24px;">
            <h2 style="font-size: 22px; color: #111827; margin-bottom: 16px;">Welcome, ${name}! 🎉</h2>

            <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
              Congratulations! Your email has been <strong>successfully verified</strong> and your <strong>EduConnect account is now active</strong>.
            </p>

            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              We're excited to have you join our community of learners and educators. You can now explore live classes, share content, connect with teachers and peers, and make the most out of your virtual learning experience.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
                style="background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 16px; border-radius: 8px; font-weight: 600; display: inline-block;">
                Go to My Dashboard
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center;">
              Need help? Visit our <a href="${url}/help" style="color: #3b82f6; text-decoration: none;">Help Center</a> or reply to this email.
            </p>

            <p style="font-size: 16px; color: #374151; margin-top: 28px;">
              Once again, welcome to <strong>EduConnect</strong> — where learning never stops! 🚀<br/>
              <strong>EduConnect Team</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f9fafb; padding: 16px; text-align: center;">
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">
              © ${new Date().getFullYear()} EduConnect. All rights reserved.<br/>
              <a href="${url}" style="color: #3b82f6; text-decoration: none;">Visit EduConnect</a>
            </p>
          </td>
        </tr>

      </table>
    </div>
  `;
};



export const accountVerificationEmailTemplate = ({ name, otp, url }) => {
  return `
    <div style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <tr>
          <td style="background-color: #1d4ed8; padding: 24px 0; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">EduConnect</h1>
            <p style="color: #dbeafe; font-size: 14px; margin: 4px 0 0;">A Virtual College Learning Platform</p>
          </td>
        </tr>

        <tr>
          <td style="padding: 32px 24px;">
            <h2 style="font-size: 22px; color: #111827; margin-bottom: 16px;">Hello ${name},</h2>

            <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
              Thank you for joining <strong>EduConnect</strong>! To complete your registration and secure your account, please verify your email address using the One-Time Password (OTP) below:
            </p>

            <div style="text-align: center; margin: 24px 0;">
              <div style="display: inline-block; background-color: #eff6ff; border: 2px dashed #3b82f6; padding: 16px 32px; border-radius: 8px;">
                <span style="font-size: 28px; letter-spacing: 4px; color: #1e3a8a; font-weight: bold;">${otp}</span>
              </div>
            </div>

            <p style="font-size: 15px; color: #374151; margin-bottom: 20px;">
              This OTP is valid for the next <strong>30 minutes</strong>. Please enter it on the verification page to activate your EduConnect account.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
                style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 16px; border-radius: 8px; font-weight: 600; display: inline-block;">
                Verify My Account
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center;">
              If you didn’t request this, please ignore this email. Your account will remain safe and inactive.
            </p>

            <p style="font-size: 16px; color: #374151; margin-top: 28px;">
              Welcome aboard,<br />
              <strong>EduConnect Team</strong>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background-color: #f9fafb; padding: 16px; text-align: center;">
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">
              © ${new Date().getFullYear()} EduConnect. All rights reserved.<br/>
              <a href="${url}" style="color: #3b82f6; text-decoration: none;">Visit EduConnect</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
};

export const enrollmentEmailTemplate = ({ name, courseTitle, url }) => {
  return `
    <div style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" 
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; 
        border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <tr>
          <td style="background-color: #1d4ed8; padding: 24px 0; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">EduConnect</h1>
            <p style="color: #dbeafe; font-size: 14px; margin: 4px 0 0;">
              A Virtual College Learning Platform
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 32px 24px;">
            <h2 style="font-size: 22px; color: #111827; margin-bottom: 16px;">Hello ${name},</h2>

            <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
              You have been successfully <strong>enrolled</strong> in the following course on <strong>EduConnect</strong>:
            </p>

            <div style="margin: 22px 0; text-align: center;">
              <div style="display: inline-block; background-color: #eff6ff; border: 2px solid #3b82f6;
                padding: 16px 32px; border-radius: 8px;">
                <span style="font-size: 20px; color: #1e3a8a; font-weight: bold;">
                  ${courseTitle}
                </span>
              </div>
            </div>

            <p style="font-size: 15px; color: #374151; margin-bottom: 20px;">
              You can now access course material, assignments, live classes, and more.
              Click the button below to open your course dashboard.
            </p>

            <!-- Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}"
                style="background-color: #2563eb; color: #ffffff; text-decoration: none; 
                padding: 12px 28px; font-size: 16px; border-radius: 8px; 
                font-weight: 600; display: inline-block;">
                Go to Course
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center;">
              If you believe this was a mistake, please contact your course instructor.
            </p>

            <p style="font-size: 16px; color: #374151; margin-top: 28px;">
              Best regards,<br />
              <strong>EduConnect Team</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f9fafb; padding: 16px; text-align: center;">
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">
              © ${new Date().getFullYear()} EduConnect. All rights reserved.<br/>
              <a href="${url}" style="color: #3b82f6; text-decoration: none;">Visit Course</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
};

export const inviteToJoinPlatformTemplate = ({ name, courseTitle, signupUrl }) => {
  return `
    <div style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" 
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; 
        border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <tr>
          <td style="background-color: #1d4ed8; padding: 24px 0; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">EduConnect</h1>
            <p style="color: #dbeafe; font-size: 14px; margin: 4px 0 0;">
              A Virtual College Learning Platform
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 32px 24px;">
            <h2 style="font-size: 22px; color: #111827; margin-bottom: 16px;">Hello ${name},</h2>

            <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
              You have been added as a student to the course 
              <strong>${courseTitle}</strong> on EduConnect.
            </p>

            <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
              However, it looks like you are not yet registered on our platform. 
              To access course materials, assignments, live classes, and more, 
              we encourage you to join EduConnect today.
            </p>

            <!-- Signup Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${signupUrl}"
                style="background-color: #2563eb; color: #ffffff; text-decoration: none; 
                padding: 12px 28px; font-size: 16px; border-radius: 8px; 
                font-weight: 600; display: inline-block;">
                Sign Up & Join the Course
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center;">
              Once you sign up, you will have full access to the course content and notifications.
            </p>

            <p style="font-size: 16px; color: #374151; margin-top: 28px;">
              Looking forward to having you onboard,<br />
              <strong>EduConnect Team</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f9fafb; padding: 16px; text-align: center;">
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">
              © ${new Date().getFullYear()} EduConnect. All rights reserved.<br/>
              <a href="${signupUrl}" style="color: #3b82f6; text-decoration: none;">Sign Up Now</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
};

