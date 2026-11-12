
const notifications = [
  {
    id: 1,
    title: "New Service Request",
    message: "A customer has requested plumbing service.",
    notification_type: "new_request",
    service_request: 101,
    complaint: null,
    is_read: false,
    created_at: "2026-11-12T10:30:00+05:30",
  },
  {
    id: 2,
    title: "Request Cancelled",
    message: "A customer cancelled the service request.",
    notification_type: "request_cancelled",
    service_request: null,
    complaint: null,
    is_read: true,
    created_at: "2026-11-11T10:00:00+05:30",
  },
  {
    id: 3,
    title: "Explanation Requested",
    message: "Admin has requested an explanation.",
    notification_type: "explanation_requested",
    service_request: null,
    complaint: 15,
    is_read: false,
    created_at: "2026-11-11T09:00:00+05:30",
  },
];

// --------------------------------------------------
// API MOCKS
// --------------------------------------------------

const mockNotifications = () => {
  cy.intercept("GET", "**/api/notifications/", (req) => {
  console.log("Notifications GET request:", req.url);

  req.reply({
    statusCode: 200,
    body: notifications,
  });
}).as("getNotifications");

  cy.intercept("GET", "**/api/notifications/unread-count/", {
    statusCode: 200,
    body: { unread_count: 2 },
  }).as("getUnreadCount");

  cy.intercept("POST", "**/api/notifications/*/mark-read/", {
    statusCode: 200,
    body: { message: "Notification marked as read." },
  }).as("markNotificationRead");
};

// --------------------------------------------------
// AUTHENTICATED PROVIDER VISIT
// --------------------------------------------------

const visitProviderNotifications = () => {
  cy.visit("/provider/notifications", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "accessToken",
        "test-provider-token"
      );

      win.localStorage.setItem(
        "refreshToken",
        "test-refresh-token"
      );

      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: 10,
          username: "provider1",
          full_name: "Test Provider",
          role: "provider",
        })
      );
    },
  });

  cy.wait("@getNotifications");
  cy.wait("@getNotifications").then((interception) => {
  cy.log("Notifications API response");

  console.log(
    "Intercepted response:",
    interception.response?.body
  );
});
};

// --------------------------------------------------
// NOTIFICATION CARD HELPER
// --------------------------------------------------

const notificationCards = () =>
  cy.get('[data-cy="notification-card"]');

const notificationCard = (title) =>
  notificationCards().contains(title);

// --------------------------------------------------
// TEST SUITE
// --------------------------------------------------

describe("Provider Notifications", () => {
  beforeEach(() => {
    mockNotifications();
    visitProviderNotifications();
  });

  // 1. Display notification page

  it("should display the provider notifications page", () => {
    cy.contains("h1", "Notifications").should("be.visible");

    cy.contains("Total Notifications").should("be.visible");
    cy.contains("Unread").should("be.visible");
    cy.contains("Read").should("be.visible");

    notificationCard("New Service Request").should("be.visible");

    notificationCards().should("have.length", 3);
  });

  // 2. Display unread notifications before read notifications

  it("should display unread notifications before read notifications", () => {
    notificationCards()
      .should("have.length", 3)
      .then(($cards) => {
        const cardTexts = [...$cards].map(
          (card) => card.innerText
        );

        const firstUnreadIndex = cardTexts.findIndex((text) =>
          text.includes("New Service Request")
        );

        const secondUnreadIndex = cardTexts.findIndex((text) =>
          text.includes("Explanation Requested")
        );

        const readIndex = cardTexts.findIndex((text) =>
          text.includes("Request Cancelled")
        );

        expect(firstUnreadIndex).to.be.greaterThan(-1);
        expect(secondUnreadIndex).to.be.greaterThan(-1);
        expect(readIndex).to.be.greaterThan(-1);

        expect(firstUnreadIndex).to.be.lessThan(readIndex);
        expect(secondUnreadIndex).to.be.lessThan(readIndex);

        // Newest unread notification should appear first.
        expect(firstUnreadIndex).to.be.lessThan(secondUnreadIndex);
      });
  });

  // 3. Search notifications by title or message

  it("should search notifications by title or message", () => {
    cy.get('input[placeholder="Search notifications..."]')
      .should("be.visible")
      .type("plumbing");

    notificationCards().should("have.length", 1);

    notificationCard("New Service Request").should("be.visible");
  });

  // 4. Display only unread notifications

  it("should display only unread notifications", () => {
    cy.get("select").eq(0).select("unread");

    notificationCards().should("have.length", 2);

    notificationCard("New Service Request").should("exist");
    notificationCard("Explanation Requested").should("exist");

    notificationCards().should("not.contain", "Request Cancelled");
  });

  // 5. Display only read notifications

  it("should display only read notifications", () => {
    cy.get("select").eq(0).select("read");

    notificationCards().should("have.length", 1);

    notificationCard("Request Cancelled").should("exist");

    notificationCards().should("not.contain", "New Service Request");
    notificationCards().should("not.contain", "Explanation Requested");
  });

  // 6. Filter notifications by type

  it("should filter notifications by type", () => {
    cy.get("select").eq(1).select("new_request");

    notificationCards().should("have.length", 1);

    notificationCard("New Service Request").should("exist");

    notificationCards().should("not.contain", "Request Cancelled");
    notificationCards().should("not.contain", "Explanation Requested");
  });

  // 7. Mark notification as read

  it("should mark an unread notification as read when clicked", () => {
    cy.contains('[data-cy="notification-card"]', "Explanation Requested")
      .click();

    cy.wait("@markNotificationRead")
      .its("request.url")
      .should("include", "/3/mark-read/");

    cy.contains('[data-cy="notification-card"]', "Explanation Requested")
      .should("contain", "Read");
  });

  // 8. Navigate to service request details

  it("should navigate to service request details when clicked", () => {
    cy.contains('[data-cy="notification-card"]', "New Service Request")
      .click();

    cy.wait("@markNotificationRead");

    cy.location("pathname").should(
      "eq",
      "/provider/bookings/101"
    );
  });

  // 9. Display unread notification count in header

  it("should display the unread notification count in the header", () => {
    cy.wait("@getUnreadCount");

    cy.get('button[aria-label^="View notifications"]')
      .should("be.visible")
      .and("contain", "2");
  });

  // 10. Display empty state

  it("should display empty state when no notifications exist", () => {
    cy.intercept("GET", "**/api/notifications/", {
      statusCode: 200,
      body: [],
    }).as("emptyNotifications");

    cy.reload();

    cy.wait("@emptyNotifications");

    cy.contains("No notifications found").should("be.visible");

    notificationCards().should("have.length", 0);
  });

  // 11. Display API error state

  it("should display error when notification API fails", () => {
    cy.intercept("GET", "**/api/notifications/", {
      statusCode: 500,
      body: { detail: "Server error" },
    }).as("failedNotifications");

    cy.reload();

    cy.wait("@failedNotifications");

    cy.contains(
      "Unable to load notifications. Please try again."
    ).should("be.visible");

    cy.contains("Try again").should("be.visible");
  });

  // 12. Refresh notifications

  it("should fetch notifications again when refresh is clicked", () => {
    cy.contains("button", "Refresh")
      .should("be.visible")
      .click();

    cy.wait("@getNotifications");

    notificationCard("New Service Request").should("be.visible");

    notificationCards().should("have.length", 3);
  });
});
