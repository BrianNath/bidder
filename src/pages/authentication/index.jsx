import fetchApi from "@/utils/fetchApi";
import { useRouter } from "next/router";
import { useState } from "react";
import { pbErrorMapper } from "@/lib/pocketbase";
import { useEffect } from "react";

async function authenticate(body) {
  const payload = {
    method: "POST",
    url: "/api/authentication/login",
    body,
  };
  const response = await fetchApi(payload);
  // console.log("RESPONSE: ", response);
  if (response.isOk) {
    localStorage.setItem("authToken", `${response.token}`);
    return { success: true };
  }
  // console.log(response);
  return { success: false, error: response.error.data.message };
}

export default function Login() {
  const [site, setSite] = useState("login");

  return (
    <>
      {site == "register" ? (
        <RegisterComponent changeSite={() => setSite("login")} />
      ) : (
        <LoginComponent changeSite={() => setSite("register")} />
      )}
    </>
  );
}

function LoginComponent({ changeSite }) {
  const router = useRouter();
  const [onLoading, setOnLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleLogin = async (event) => {
    setOnLoading(true);
    event.preventDefault();

    const body = {
      username: event.target.username.value,
      password: event.target.password.value,
    };

    let { success, error } = await authenticate(body);

    if (success) {
      router.push("/");
      setOnLoading(false);
    } else {
      console.log("ERROR:", error);
      error ? error : (error = "Unexpected Error");
      setErrorMessage(error);
      setShowError(true);
      setOnLoading(false);
    }
  };
  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Sign in to your account
              </h1>
              {showError ? (
                <div className="alert alert-error shadow-lg text-white bg-red-500">
                  <div className="flex justify-between w-full">
                    <span className="ml-2">{errorMessage}</span>
                    <svg
                      onClick={() => setShowError(false)}
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current cursor-pointer h-6 w-6 mr-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                ""
              )}
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    placeholder="Your Username"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="********"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                {!onLoading ? (
                  <button type="submit" className="w-full btn">
                    Sign in
                  </button>
                ) : (
                  <button className="w-full btn btn-disabled loading font-medium rounded-lg text-sm" />
                )}
                <p className="text-sm font-light text-gray-500">
                  Don&prime;t have an account yet?
                  <a
                    onClick={changeSite}
                    className="font-medium cursor-pointer text-primary-600 hover:underline ml-1"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function RegisterComponent({ changeSite }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState({});
  const [showError, setShowError] = useState(false);
  const [onLoading, setOnLoading] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  async function getAllRolesRegister() {
    const payload = {
      url: `/api/roles/get-all-roles-register`,
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    if (fetch.isOk) {
      setRoleList(fetch.record);
    }
  }

  const handleRegister = async (event) => {
    setOnLoading(true);
    event.preventDefault();

    const body = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
      passwordConfirm: event.target.confirmPassword.value,
      name: event.target.name.value,
      emailVisibility: true,
      roleId: selectedRole,
    };

    const payload = {
      method: "POST",
      url: "/api/authentication/register",
      body,
    };
    const response = await fetchApi(payload);

    // console.log("RESPONSE: ", response);

    if (!response.isOk) {
      const error = pbErrorMapper(response);
      // console.log("ERROR: ", error);
      setShowError(true);
      setErrorMessage(error.errorLabel);
    } else {
      let { success, error } = await authenticate({
        username: body.username,
        password: body.password,
      });

      if (success) {
        router.push("/");
      } else {
        console.log("ERROR:", error);
        setErrorMessage(error);
        setShowError(true);
      }
    }
    setOnLoading(false);
  };

  useEffect(() => {
    getAllRolesRegister();
  }, []);

  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Create new account
              </h1>
              {showError ? (
                <div className="alert alert-error shadow-lg text-white bg-red-500">
                  <div className="flex justify-between w-full">
                    <div className="ml-2 space-y-2 text-sm">
                      {Object.keys(errorMessage).map(function (key) {
                        return (
                          <div key={key}>
                            <span className="font-medium">
                              {key.toUpperCase()}
                            </span>
                            {Object.keys(errorMessage[key]).map(function (
                              error
                            ) {
                              return (
                                <li key={errorMessage[key].message}>
                                  {errorMessage[key][error]}
                                </li>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                    <svg
                      onClick={() => setShowError(false)}
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current cursor-pointer h-6 w-6 mr-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                ""
              )}
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleRegister}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Username
                    <span className="ml-1 text-gray-300">ex : john_doe23</span>
                  </label>
                  <input
                    pattern="[a-zA-Z0-9_]+"
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Your_Username"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@mail.com"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Roles
                  </label>
                  {roleList.map((role) => {
                    return (
                      <div className="form-control" key={role.id}>
                        <label className="label cursor-pointer">
                          <span className="uppercase font-medium">
                            {role.roleName}
                          </span>
                          <input
                            onChange={() => setSelectedRole(role.id)}
                            type="radio"
                            name="roles"
                            className="radio checked:bg-blue-500"
                            required
                            value={role.id}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="********"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="********"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                {!onLoading ? (
                  <button type="submit" className="w-full btn">
                    Sign up
                  </button>
                ) : (
                  <button className="w-full btn btn-disabled loading font-medium rounded-lg text-sm" />
                )}
                <p className="text-sm font-light text-gray-500">
                  Already have an account?
                  <a
                    onClick={changeSite}
                    className="font-medium cursor-pointer text-primary-600 hover:underline ml-1"
                  >
                    Sign In
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
