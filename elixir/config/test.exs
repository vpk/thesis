use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :scalability_test, ScalabilityTestWeb.Endpoint,
  http: [port: 4002, protocol_options: [idle_timeout: 600_000]],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn
