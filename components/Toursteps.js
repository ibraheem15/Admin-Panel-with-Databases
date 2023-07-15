export const steps = [
  {
    target: "#dashboard",
    // content:
    //   "Welcome to the Dashboard! This is the main page of your application where you can monitor and view the amount of data.",
    content: (
      <>
        <h1
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
          }}
        >
          Dashboard
        </h1>
        <p>
          Welcome to the Dashboard! This is the main page of your application
          where you can monitor and view the amount of data.
        </p>
      </>
    ),
  },
  {
    target: "#categories",
    content: (
      <>
        <h1
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
          }}
        >
          Categories
        </h1>
        <p>
          This section displays the categories in your application. You can add,
          edit, or delete categories from here.
        </p>
      </>
    ),
  },
  {
    target: "#add_category",
    content: (
        <>
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "30px",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                }}
            >
                Add Category
            </h1>
            <p>
                This button allows you to add a new category to your application.
            </p>
        </>
    ),
  },
  {
    target: "#products",
    content: (
      <>
        <h1
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
          }}
        >
          Products
        </h1>
        <p>
          This section displays the products in your application. You can add,
          edit, or delete products from here.
        </p>
      </>
    ),
  },
  {
    target: "#notification",
    content: (
      <>
        <h1
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
          }}
        >
          Notification
        </h1>
        <p>
          This section shows{" "}
          <span style={{ fontWeight: "bold" }}>notifications</span> related to
          your application with total number of notifications displayed in front of it
        </p>
      </>
    ),
  },
  {
    target: "#profile",
    content: (
      <>
        <h1
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
          }}
        >
          Profile
        </h1>
        <p>
          This section allows you to view and update your{" "}
          <span style={{ fontWeight: "bold" }}>profile</span> information.
        </p>
      </>
    ),
  },
  {
    target: "#signout",
    content: (
      <>
        <h1
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
          }}
        >
          Sign Out
        </h1>
        <p>
          Clicking on this button will{" "}
          <span style={{ fontWeight: "bold" }}>sign you out</span> from the
          application.
        </p>
      </>
    ),
  },
];
