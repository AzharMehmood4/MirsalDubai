import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";

export default function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;

    // Map patterns → titles
    const routeTitles = [
      { pattern: { path: "/", end: true }, title: "Login | VCC List Site" }, // keep your existing title
      { pattern: { path: "/view", end: true }, title: "VCC List" },
      { pattern: { path: "/add-record", end: true }, title: "VCC List" },
      // case-insensitive, dynamic segment
      // { pattern: { path: "/view-file/:vccNo", caseSensitive: false }, title: "View VCC Details" },
      {
        pattern: { path: "/m2decext/vcc/invokeViewDigitalVCCDetails.do" },
        title: "View VCC Details",
      },
      // optional, if you ever want this too:
      {
        pattern: { path: "/edit-record/:vccNo", caseSensitive: false },
        title: " VCC List",
      },
      {
        pattern: { path: "/-record/:vccNo", caseSensitive: false },
        title: " VCC List",
      },
    ];

    const matched = routeTitles.find((r) => matchPath(r.pattern, pathname));
    document.title = matched ? matched.title : "Login | VCC List Site";
  }, [location]);

  return null;
}