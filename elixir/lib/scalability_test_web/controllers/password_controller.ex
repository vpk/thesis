defmodule ScalabilityTestWeb.PasswordController do
  use ScalabilityTestWeb, :controller

  def set_password(conn, _params) do
    text(conn, "OK")
  end

  def verify_password(conn, _params) do
    text(conn, "OK")
  end
end
