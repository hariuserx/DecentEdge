# Copyright (c) Open Enclave SDK contributors.
# Licensed under the MIT License.

include ../../config.mk

CFLAGS=$(shell pkg-config oehost-$(C_COMPILER) --cflags)
CXXFLAGS=$(shell pkg-config oehost-$(CXX_COMPILER) --cflags)
LDFLAGS=$(shell pkg-config oehost-$(CXX_COMPILER) --libs)
INCDIR=$(shell pkg-config oehost-$(C_COMPILER) --variable=includedir)

all: build


build:
	@ echo "Compilers used: $(CC), $(CXX)"
	oeedger8r ../nftm.edl --untrusted \
		--search-path $(INCDIR) \
		--search-path $(INCDIR)/openenclave/edl/sgx
	LD_LIBRARY_PATH=/usr/local/lib $(CC) -g -c $(CFLAGS) $(CINCLUDES) nftm_u.c
	LD_LIBRARY_PATH=/usr/local/lib $(CXX) -g -c $(CXXFLAGS) $(INCLUDES) -std=c++11 host.cpp
	LD_LIBRARY_PATH=/usr/local/lib $(CXX) -o nftmhost host.o nftm_u.o $(LDFLAGS) -lsecp256k1

clean:
	rm -f nftmhost *.o nftm_u.*  nftm_args.h
