
const notifications = [
  {
    id: 104,
    title: "Read older notification",
    message: "An older complaint was updated.",
    notification_type: "complaint_updated",
    complaint: 14,
    service_request: null,
    is_read: true,
    created_at: "2026-11-10T09:00:00Z",
  },
  {
    id: 103,
    title: "Read newer notification",
    message: "A complaint was resolved.",
    notification_type: "complaint_resolved",
    complaint: 13,
    service_request: null,
    is_read: true,
    created_at: "2026-11-11T09:00:00Z",
  },
  {
    id: 102,
    title: "Unread older notification",
    message: "A provider responded to a complaint.",
    notification_type: "provider_responded",
    complaint: 12,
    service_request: null,
    is_read: false,
    created_at: "2026-11-10T10:00:00Z",
  },
  {
    id: 101,
    title: "Unread newer notification",
    message: "A new complaint has been submitted.",
    notification_type: "new_complaint",
    complaint: 11,
    service_request: null,
    is_read: false,
    created_at: "2026-11-11T10:00:00Z",
  },
];

describe("Admin Notifications", () => {
  beforeEach(() => {
    // Seed the authentication state expected by your Redux slice.
    // This bypasses the login screen while testing notification features.
    cy.visit("/admin/notifications", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "accessToken",
          "cypress-test-access-token"
        );

        win.localStorage.setItem(
          "refreshToken",
          "cypress-test-refresh-token"
        );

        win.localStorage.setItem(
          "user",
          JSON.stringify({
            email: "admin@example.com",
            role: "admin",
          })
        );
      },
    });

    cy.intercept(
      "GET",
      /\/notifications\/$/,
      {
        statusCode: 200,
        body: notifications,
      }
    ).as("getNotifications");

    cy.intercept(
      "GET",
      "**/notifications/unread-count/",
      {
        statusCode: 200,
        body: { unread_count: 2 },
      }
    ).as("getUnreadCount");

    // Reload after setting intercepts so the page request is captured.
    cy.reload();

    cy.wait("@getNotifications");
  });

  it("should display the notifications page", () => {
    cy.contains("h1", "Notifications").should("be.visible");

    cy.contains("Total Notifications").should("be.visible");
    cy.contains("Unread").should("be.visible");
    cy.contains("Read").should("be.visible");
  });

  it("should display unread notifications before read notifications", () => {
    cy.get("main h3").then(($titles) => {
      const actualTitles = [...$titles].map((element) =>
        element.innerText.trim()
      );

      expect(actualTitles).to.deep.equal([
        "Unread newer notification",
        "Unread older notification",
        "Read newer notification",
        "Read older notification",
      ]);
    });
  });

  it("should display newer notifications first within each group", () => {
    cy.get("main h3").then(($titles) => {
      const actualTitles = [...$titles].map((element) =>
        element.innerText.trim()
      );

      expect(actualTitles.indexOf("Unread newer notification"))
        .to.be.lessThan(
          actualTitles.indexOf("Unread older notification")
        );

      expect(actualTitles.indexOf("Read newer notification"))
        .to.be.lessThan(
          actualTitles.indexOf("Read older notification")
        );
    });
  });

  it("should filter unread notifications", () => {
    cy.get("main select").eq(0).select("unread");

    cy.get("main h3").should("have.length", 2);

    cy.contains("Unread newer notification").should("be.visible");
    cy.contains("Unread older notification").should("be.visible");
    cy.contains("Read newer notification").should("not.exist");
  });

  it("should filter read notifications", () => {
    cy.get("main select").eq(0).select("read");

    cy.get("main h3").should("have.length", 2);

    cy.contains("Read newer notification").should("be.visible");
    cy.contains("Read older notification").should("be.visible");
    cy.contains("Unread newer notification").should("not.exist");
  });

  it("should search notifications by title or message", () => {
    cy.get('input[placeholder="Search notifications..."]')
      .type("provider responded");

    cy.get("main h3").should("have.length", 1);

    cy.contains("Unread older notification").should("be.visible");
  });

  it("should mark an unread notification as read when clicked", () => {
    cy.intercept(
      "POST",
      "**/notifications/101/mark-read/",
      {
        statusCode: 200,
        body: {
          message: "Notification marked as read.",
          is_read: true,
        },
      }
    ).as("markAsRead");

    cy.contains("h3", "Unread newer notification")
      .closest("button")
      .click();

    cy.wait("@markAsRead");

    cy.contains("h3", "Unread newer notification")
      .closest("button")
      .contains("Read")
      .should("be.visible");
  });

  it("should show an empty state when no notifications match", () => {
    cy.get('input[placeholder="Search notifications..."]')
      .type("notification that does not exist");

    cy.contains("No notifications found").should("be.visible");
  });

  it("should refresh the notification list", () => {
    cy.intercept(
      "GET",
      /\/notifications\/$/,
      {
        statusCode: 200,
        body: notifications,
      }
    ).as("refreshNotifications");

    cy.contains("button", "Refresh").click();

    cy.wait("@refreshNotifications");
    cy.contains("Unread newer notification").should("be.visible");
  });
});
