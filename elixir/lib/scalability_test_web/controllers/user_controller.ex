defmodule ScalabilityTestWeb.UserController do
  use ScalabilityTestWeb, :controller

  def set_user(conn, _params) do
    json(conn, %{value: 1})
  end

  def get_user(conn, _params) do
    json(conn, %{value: 2})
  end

end
