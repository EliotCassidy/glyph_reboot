import { Suspense } from "react";
import { Switch, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

import { AuthContextProvider } from "./AuthContext";
import { PrivateRoute, AdminRoute } from "./components/auth";
import { Navbar, Footer } from "./components/layout";
import { ScrollToTop, ErrorBoundary } from "./components/shared";
import { LanguageContextProvider } from "./LanguageContext";
import {
  Landing,
  GlobalDash,
  Signup,
  Signin,
  EditRule,
  EditScript,
  LocalDash,
  LeaderboardPoints,
  NotFound,
  ResetPassword,
  AccountSettings,
  AddNewScript,
  ForgotPassword,
  TermsAndConditions,
  DataPrivacyStatement,
  CreateRule,
  ScienceBehindGlyphVideo,
  Admin,
  TestRule,
  PromoVideo,
} from "./pages";
import { UserContextProvider } from "./UserContext";

function App() {
  return (
    <Suspense fallback="...is loading">
      <AuthContextProvider>
        <UserContextProvider>
          <LanguageContextProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="App flex flex-col">
                <Navbar />
                <div className="flex-grow">
                  <ErrorBoundary>
                    <Switch>
                      <Route exact path="/" component={Landing} />
                      <PrivateRoute exact path="/home" component={GlobalDash} />
                      <Route exact path="/signin" component={Signin} />
                      <Route exact path="/signup" component={Signup} />
                      <PrivateRoute
                        exact
                        path="/account-settings"
                        component={AccountSettings}
                      />
                      <PrivateRoute
                        exact
                        path="/leaderboard"
                        component={LeaderboardPoints}
                      />
                      <PrivateRoute
                        path="/rules/:scriptId"
                        component={LocalDash}
                      />
                      <PrivateRoute
                        path="/rule/new/:scriptId"
                        component={CreateRule}
                      />
                      <PrivateRoute path="/edit/:ruleId" component={EditRule} />
                      <AdminRoute path="/admin" component={Admin} />
                      <AdminRoute path="/script/new" component={AddNewScript} />
                      <AdminRoute
                        path="/script/edit/:scriptId"
                        component={EditScript}
                      />
                      <PrivateRoute path="/test/:ruleId" component={TestRule} />
                      <Route
                        path="/forgotPassword"
                        component={ForgotPassword}
                      />
                      <Route
                        path="/terms-and-conditions"
                        component={TermsAndConditions}
                      />
                      <Route
                        path="/data-privacy-statement"
                        component={DataPrivacyStatement}
                      />
                      <Route path="/promo-video" component={PromoVideo} />
                      <Route
                        path="/the-science-behind-glyph-video"
                        component={ScienceBehindGlyphVideo}
                      />
                      <Route path="/reset/:token" component={ResetPassword} />
                      <Route path="*" component={NotFound} />
                    </Switch>
                  </ErrorBoundary>
                </div>

                <Footer />
              </div>
            </BrowserRouter>
          </LanguageContextProvider>
        </UserContextProvider>
      </AuthContextProvider>
    </Suspense>
  );
}

export default App;
