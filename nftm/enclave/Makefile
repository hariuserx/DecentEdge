# Copyright (c) Open Enclave SDK contributors.
# Licensed under the MIT License.

include ../../config.mk

CRYPTO_LDFLAGS := $(shell pkg-config oeenclave-$(COMPILER) --variable=${OE_CRYPTO_LIB}libs)

ifeq ($(LVI_MITIGATION), ControlFlow)
    ifeq ($(LVI_MITIGATION_BINDIR),)
        $(error LVI_MITIGATION_BINDIR is not set)
    endif
    # Only run once.
    ifeq (,$(findstring $(LVI_MITIGATION_BINDIR),$(CC)))
        CC := $(LVI_MITIGATION_BINDIR)/$(CC)
    endif
    COMPILER := $(COMPILER)-lvi-cfg
    CRYPTO_LDFLAGS := $(shell pkg-config oeenclave-$(COMPILER) --variable=${OE_CRYPTO_LIB}libslvicfg)
endif

APKMAN_INITIALIZE=$(shell oeapkman)
APKMAN_ROOT=$(shell oeapkman root)
CFLAGS=$(shell pkg-config oeenclave-$(C_COMPILER) --cflags)
CXXFLAGS=$(shell pkg-config oeenclave-$(CXX_COMPILER) --cflags)
LDFLAGS=$(shell pkg-config oeenclave-$(CXX_COMPILER) --libs)
INCDIR=$(shell pkg-config oeenclave-$(C_COMPILER) --variable=includedir)

all:
	$(MAKE) build
	$(MAKE) keys
	$(MAKE) sign

build:
	@ echo "Compilers used: $(CC), $(CXX)"
	oeedger8r ../nftm.edl --trusted \
		--search-path $(INCDIR) \
		--search-path $(INCDIR)/openenclave/edl/sgx
	$(CXX) -g -c $(CXXFLAGS) $(INCLUDES) -I$(APKMAN_ROOT)/usr/include -I../../../include -I. -I.. -std=c++11 -DOE_API_VERSION=2 enc.cpp -o enc.o
	$(CC) -g -c $(CFLAGS) $(CINCLUDES) -I$(APKMAN_ROOT)/usr/include -I.. -DOE_API_VERSION=2 nftm_t.c -o nftm_t.o
	$(CXX) -o nftmenc nftm_t.o enc.o $(LDFLAGS) $(CRYPTO_LDFLAGS) -lsecp256k1 -v -ansi -pedantic -Wall -Wextra -Weffc++ -Wl,--warn-unresolved-symbols

sign:
	oesign sign -e nftmenc -c nftm.conf -k private.pem

clean:
	rm -f enc.o nftmenc nftmenc.signed private.pem public.pem nftm_t.o nftm_t.h nftm_t.c nftm_args.h

keys:
	openssl genrsa -out private.pem -3 3072
	openssl rsa -in private.pem -pubout -out public.pem
