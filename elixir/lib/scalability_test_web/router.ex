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

    post "/password/set/:username", PasswordController, :set_password
    post "/password/verify/:username", PasswordController, :verify_password
    get "/longPoll", LongPollController, :index
    get "/user/get/:username", UserController, :get_user
    post "/user/set/:username", UserController, :set_user
    get "/", DefaultController, :index

  end
end
