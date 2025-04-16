FROM rust:1.75 as builder

WORKDIR /usr/src/app
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
COPY --from=builder /usr/src/app/target/release/rust-compressor /usr/local/bin/

ENTRYPOINT ["rust-compressor"] 