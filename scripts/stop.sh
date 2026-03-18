#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Stopping FXReplayChallenge stack..."
docker compose -f "$ROOT_DIR/docker-compose.yml" down

echo "Stack stopped."
