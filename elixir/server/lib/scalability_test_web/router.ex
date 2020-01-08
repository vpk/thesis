defmodule ScalabilityTestWeb.Router do
  use ScalabilityTestWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", ScalabilityTestWeb do
    pipe_through :api
  end

  scope "/", ScalabilityTestWeb do
    pipe_through :api

    post "/password/set/:user_name", PasswordController, :set_password
    post "/password/verify/:user_name", PasswordController, :verify_password
    get "/longPoll", LongPollController, :index
    get "/user/get/:user_name", UserController, :get_user
    post "/user/set/:user_name", UserController, :set_user
    get "/", DefaultController, :index

  end
end
